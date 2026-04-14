create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to postgres;
grant usage on schema private to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.user_role as enum ('reseller', 'customer');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'reseller_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.reseller_status as enum ('pending', 'active', 'inactive', 'suspended');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists role public.user_role,
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists is_active boolean not null default true,
  add column if not exists onboarding_completed boolean not null default false;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'display_name'
  ) then
    execute $statement$
      update public.profiles
      set full_name = coalesce(nullif(full_name, ''), nullif(display_name, ''))
    $statement$;
  end if;
end
$$;

update public.profiles
set email = lower(email)
where email is not null;

alter table public.profiles
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.profiles
  drop constraint if exists profiles_email_key,
  drop constraint if exists profiles_full_name_not_blank,
  drop constraint if exists profiles_phone_not_blank;

alter table public.profiles
  add constraint profiles_full_name_not_blank
    check (full_name is null or btrim(full_name) <> ''),
  add constraint profiles_phone_not_blank
    check (phone is null or btrim(phone) <> '');

alter table public.profiles
  drop column if exists display_name,
  drop column if exists avatar_url;

create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create index if not exists profiles_role_idx
  on public.profiles (role)
  where role is not null;

create table if not exists public.resellers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  public_id uuid not null default gen_random_uuid(),
  store_name text not null,
  public_name text not null,
  search_name text not null,
  slug text not null,
  status public.reseller_status not null default 'pending',
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint resellers_public_id_key unique (public_id),
  constraint resellers_slug_key unique (slug),
  constraint resellers_store_name_not_blank check (btrim(store_name) <> ''),
  constraint resellers_public_name_not_blank check (btrim(public_name) <> ''),
  constraint resellers_search_name_not_blank check (btrim(search_name) <> ''),
  constraint resellers_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  reseller_id uuid not null references public.resellers (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists customers_reseller_id_idx
  on public.customers (reseller_id);

create index if not exists resellers_search_name_trgm_idx
  on public.resellers
  using gin (search_name gin_trgm_ops);

create index if not exists resellers_public_listing_idx
  on public.resellers (status, is_public, public_name);

create or replace function private.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function private.normalize_search_text(input_text text)
returns text
language sql
stable
as $$
  select trim(regexp_replace(lower(unaccent(coalesce(input_text, ''))), '\s+', ' ', 'g'));
$$;

create or replace function private.slugify(input_text text)
returns text
language sql
stable
as $$
  select trim(
    both '-'
    from regexp_replace(private.normalize_search_text(input_text), '[^a-z0-9]+', '-', 'g')
  );
$$;

create or replace function private.handle_auth_user_upsert()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  metadata_full_name text;
begin
  metadata_full_name := nullif(
    btrim(
      coalesce(
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name',
        new.raw_user_meta_data ->> 'display_name'
      )
    ),
    ''
  );

  insert into public.profiles (id, email, full_name)
  values (new.id, lower(new.email), metadata_full_name)
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function private.set_reseller_derived_fields()
returns trigger
language plpgsql
set search_path = public, private
as $$
begin
  new.store_name := btrim(new.store_name);
  new.public_name := coalesce(nullif(btrim(new.public_name), ''), new.store_name);
  new.slug := coalesce(nullif(private.slugify(new.slug), ''), private.slugify(new.public_name));
  new.search_name := private.normalize_search_text(new.public_name);

  if new.slug = '' then
    raise exception 'INVALID_RESELLER_SLUG';
  end if;

  if new.search_name = '' then
    raise exception 'INVALID_RESELLER_PUBLIC_NAME';
  end if;

  return new;
end;
$$;

create or replace function private.generate_unique_reseller_slug(base_text text)
returns text
language plpgsql
security definer
set search_path = public, private
as $$
declare
  base_slug text := coalesce(nullif(private.slugify(base_text), ''), 'loja');
  candidate text := base_slug;
  suffix integer := 2;
begin
  while exists (
    select 1
    from public.resellers
    where slug = candidate
  ) loop
    candidate := base_slug || '-' || suffix::text;
    suffix := suffix + 1;
  end loop;

  return candidate;
end;
$$;

create or replace function private.ensure_profile_can_assume_role(
  target_profile_id uuid,
  target_role public.user_role
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_role public.user_role;
begin
  select role
  into current_role
  from public.profiles
  where id = target_profile_id;

  if not found then
    raise exception 'PROFILE_NOT_FOUND';
  end if;

  if current_role is not null and current_role <> target_role then
    raise exception 'PROFILE_ROLE_ALREADY_DEFINED';
  end if;

  if target_role = 'reseller' and exists (
    select 1
    from public.customers
    where profile_id = target_profile_id
  ) then
    raise exception 'PROFILE_ALREADY_REGISTERED_AS_CUSTOMER';
  end if;

  if target_role = 'customer' and exists (
    select 1
    from public.resellers
    where profile_id = target_profile_id
  ) then
    raise exception 'PROFILE_ALREADY_REGISTERED_AS_RESELLER';
  end if;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function private.set_current_timestamp_updated_at();

drop trigger if exists set_resellers_updated_at on public.resellers;
create trigger set_resellers_updated_at
before update on public.resellers
for each row
execute function private.set_current_timestamp_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row
execute function private.set_current_timestamp_updated_at();

drop trigger if exists set_resellers_derived_fields on public.resellers;
create trigger set_resellers_derived_fields
before insert or update of store_name, public_name, slug on public.resellers
for each row
execute function private.set_reseller_derived_fields();

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_upsert on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_auth_user_upsert();

create trigger on_auth_user_upsert
after update of email, raw_user_meta_data on auth.users
for each row
when (old.email is distinct from new.email or old.raw_user_meta_data is distinct from new.raw_user_meta_data)
execute function private.handle_auth_user_upsert();

create or replace function public.get_current_user_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.get_my_user_context()
returns table (
  profile_id uuid,
  role public.user_role,
  is_active boolean,
  onboarding_completed boolean,
  reseller_id uuid,
  reseller_public_id uuid,
  customer_id uuid,
  linked_reseller_id uuid,
  linked_reseller_public_id uuid
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.id as profile_id,
    p.role,
    p.is_active,
    p.onboarding_completed,
    own_reseller.id as reseller_id,
    own_reseller.public_id as reseller_public_id,
    c.id as customer_id,
    c.reseller_id as linked_reseller_id,
    linked_reseller.public_id as linked_reseller_public_id
  from public.profiles p
  left join public.resellers own_reseller
    on own_reseller.profile_id = p.id
  left join public.customers c
    on c.profile_id = p.id
  left join public.resellers linked_reseller
    on linked_reseller.id = c.reseller_id
  where p.id = auth.uid();
$$;

create or replace function public.search_resellers(
  search_term text default null,
  result_limit integer default 10
)
returns table (
  public_id uuid,
  public_name text,
  slug text,
  status public.reseller_status
)
language sql
security definer
stable
set search_path = public, private
as $$
  with params as (
    select private.normalize_search_text(search_term) as normalized_query
  )
  select
    r.public_id,
    r.public_name,
    r.slug,
    r.status
  from public.resellers r
  cross join params
  where r.is_public = true
    and r.status = 'active'
    and char_length(params.normalized_query) >= 2
    and r.search_name like '%' || params.normalized_query || '%'
  order by similarity(r.search_name, params.normalized_query) desc, r.public_name asc
  limit least(greatest(coalesce(result_limit, 10), 1), 20);
$$;

create or replace function public.complete_reseller_onboarding(
  p_full_name text,
  p_store_name text,
  p_public_name text default null,
  p_phone text default null,
  p_slug text default null
)
returns table (
  profile_id uuid,
  role public.user_role,
  is_active boolean,
  onboarding_completed boolean,
  reseller_id uuid,
  reseller_public_id uuid,
  customer_id uuid,
  linked_reseller_id uuid,
  linked_reseller_public_id uuid
)
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_profile_id uuid := auth.uid();
  normalized_full_name text := nullif(btrim(p_full_name), '');
  normalized_store_name text := nullif(btrim(p_store_name), '');
  normalized_public_name text := coalesce(nullif(btrim(p_public_name), ''), normalized_store_name);
  normalized_phone text := nullif(btrim(p_phone), '');
  requested_slug text := nullif(private.slugify(p_slug), '');
  final_slug text;
begin
  if current_profile_id is null then
    raise exception 'AUTHENTICATION_REQUIRED';
  end if;

  if normalized_full_name is null then
    raise exception 'FULL_NAME_REQUIRED';
  end if;

  if normalized_store_name is null then
    raise exception 'STORE_NAME_REQUIRED';
  end if;

  perform private.ensure_profile_can_assume_role(current_profile_id, 'reseller');

  if requested_slug is null then
    final_slug := private.generate_unique_reseller_slug(normalized_public_name);
  else
    if exists (
      select 1
      from public.resellers
      where slug = requested_slug
        and profile_id <> current_profile_id
    ) then
      raise exception 'SLUG_ALREADY_IN_USE';
    end if;

    final_slug := requested_slug;
  end if;

  update public.profiles
  set
    role = 'reseller',
    full_name = normalized_full_name,
    phone = normalized_phone,
    onboarding_completed = true,
    is_active = true,
    updated_at = timezone('utc', now())
  where id = current_profile_id;

  insert into public.resellers (
    profile_id,
    store_name,
    public_name,
    search_name,
    slug,
    status,
    is_public
  )
  values (
    current_profile_id,
    normalized_store_name,
    normalized_public_name,
    private.normalize_search_text(normalized_public_name),
    final_slug,
    'active',
    true
  )
  on conflict (profile_id) do update
  set
    store_name = excluded.store_name,
    public_name = excluded.public_name,
    search_name = excluded.search_name,
    slug = excluded.slug,
    status = excluded.status,
    is_public = excluded.is_public,
    updated_at = timezone('utc', now());

  return query
  select *
  from public.get_my_user_context();
end;
$$;

create or replace function public.complete_customer_onboarding(
  p_full_name text,
  p_reseller_public_id uuid,
  p_phone text default null
)
returns table (
  profile_id uuid,
  role public.user_role,
  is_active boolean,
  onboarding_completed boolean,
  reseller_id uuid,
  reseller_public_id uuid,
  customer_id uuid,
  linked_reseller_id uuid,
  linked_reseller_public_id uuid
)
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_profile_id uuid := auth.uid();
  normalized_full_name text := nullif(btrim(p_full_name), '');
  normalized_phone text := nullif(btrim(p_phone), '');
  selected_reseller public.resellers%rowtype;
  existing_reseller_id uuid;
begin
  if current_profile_id is null then
    raise exception 'AUTHENTICATION_REQUIRED';
  end if;

  if normalized_full_name is null then
    raise exception 'FULL_NAME_REQUIRED';
  end if;

  if p_reseller_public_id is null then
    raise exception 'RESELLER_REQUIRED';
  end if;

  perform private.ensure_profile_can_assume_role(current_profile_id, 'customer');

  select *
  into selected_reseller
  from public.resellers
  where public_id = p_reseller_public_id
    and is_public = true
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'RESELLER_NOT_FOUND_OR_UNAVAILABLE';
  end if;

  select reseller_id
  into existing_reseller_id
  from public.customers
  where profile_id = current_profile_id;

  if existing_reseller_id is not null and existing_reseller_id <> selected_reseller.id then
    raise exception 'CUSTOMER_ALREADY_LINKED_TO_ANOTHER_RESELLER';
  end if;

  update public.profiles
  set
    role = 'customer',
    full_name = normalized_full_name,
    phone = normalized_phone,
    onboarding_completed = true,
    is_active = true,
    updated_at = timezone('utc', now())
  where id = current_profile_id;

  insert into public.customers (
    profile_id,
    reseller_id
  )
  values (
    current_profile_id,
    selected_reseller.id
  )
  on conflict (profile_id) do update
  set
    reseller_id = excluded.reseller_id,
    updated_at = timezone('utc', now());

  return query
  select *
  from public.get_my_user_context();
end;
$$;

grant usage on type public.user_role to anon, authenticated;
grant usage on type public.reseller_status to anon, authenticated;

revoke all on public.profiles from anon, authenticated;
revoke all on public.resellers from anon, authenticated;
revoke all on public.customers from anon, authenticated;

grant select on public.profiles to authenticated;
grant select on public.resellers to authenticated;
grant select on public.customers to authenticated;

alter table public.profiles enable row level security;
alter table public.resellers enable row level security;
alter table public.customers enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_select_linked_customers on public.profiles;
create policy profiles_select_linked_customers
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.customers c
    join public.resellers r
      on r.id = c.reseller_id
    where c.profile_id = profiles.id
      and r.profile_id = auth.uid()
  )
);

drop policy if exists resellers_select_self on public.resellers;
create policy resellers_select_self
on public.resellers
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists customers_select_self on public.customers;
create policy customers_select_self
on public.customers
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists customers_select_for_linked_reseller on public.customers;
create policy customers_select_for_linked_reseller
on public.customers
for select
to authenticated
using (
  exists (
    select 1
    from public.resellers r
    where r.id = customers.reseller_id
      and r.profile_id = auth.uid()
  )
);

revoke all on all functions in schema private from public;
revoke all on all functions in schema private from anon;
revoke all on all functions in schema private from authenticated;

revoke all on function public.get_current_user_role() from public;
grant execute on function public.get_current_user_role() to authenticated;

revoke all on function public.get_my_user_context() from public;
grant execute on function public.get_my_user_context() to authenticated;

revoke all on function public.search_resellers(text, integer) from public;
grant execute on function public.search_resellers(text, integer) to anon, authenticated;

revoke all on function public.complete_reseller_onboarding(text, text, text, text, text) from public;
grant execute on function public.complete_reseller_onboarding(text, text, text, text, text) to authenticated;

revoke all on function public.complete_customer_onboarding(text, uuid, text) from public;
grant execute on function public.complete_customer_onboarding(text, uuid, text) to authenticated;
