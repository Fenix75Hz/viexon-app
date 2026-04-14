drop function if exists private.ensure_profile_can_assume_role(uuid, name);
drop function if exists private.ensure_profile_can_assume_role(uuid, public.user_role);

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

  if target_role = 'reseller'::public.user_role and exists (
    select 1
    from public.customers
    where profile_id = target_profile_id
  ) then
    raise exception 'PROFILE_ALREADY_REGISTERED_AS_CUSTOMER';
  end if;

  if target_role = 'customer'::public.user_role and exists (
    select 1
    from public.resellers
    where profile_id = target_profile_id
  ) then
    raise exception 'PROFILE_ALREADY_REGISTERED_AS_RESELLER';
  end if;
end;
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

  perform private.ensure_profile_can_assume_role(
    current_profile_id,
    'reseller'::public.user_role
  );

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

  perform private.ensure_profile_can_assume_role(
    current_profile_id,
    'customer'::public.user_role
  );

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
