import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CurrentUserContext, Database, UserRole } from "@/types/database";

function getOptionalString(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeSearchText(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input: string) {
  return normalizeSearchText(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getAuthenticatedUser(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  return user;
}

async function ensureProfileRow(
  admin: SupabaseClient<Database>,
  user: User,
  fullName: string,
  phone?: string | null,
) {
  const { error } = await admin.from("profiles").upsert(
    {
      email: user.email?.trim().toLowerCase() ?? null,
      full_name: fullName,
      id: user.id,
      phone: getOptionalString(phone),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw error;
  }
}

async function assertProfileCanAssumeRole(
  admin: SupabaseClient<Database>,
  profileId: string,
  targetRole: UserRole,
) {
  const [profileResult, resellerResult, customerResult] = await Promise.all([
    admin.from("profiles").select("role").eq("id", profileId).maybeSingle(),
    admin.from("resellers").select("id, profile_id, public_id, slug").eq("profile_id", profileId).maybeSingle(),
    admin.from("customers").select("id, reseller_id").eq("profile_id", profileId).maybeSingle(),
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (resellerResult.error) {
    throw resellerResult.error;
  }

  if (customerResult.error) {
    throw customerResult.error;
  }

  const currentRole = profileResult.data?.role ?? null;

  if (currentRole && currentRole !== targetRole) {
    throw new Error("PROFILE_ROLE_ALREADY_DEFINED");
  }

  if (targetRole === "reseller" && customerResult.data) {
    throw new Error("PROFILE_ALREADY_REGISTERED_AS_CUSTOMER");
  }

  if (targetRole === "customer" && resellerResult.data) {
    throw new Error("PROFILE_ALREADY_REGISTERED_AS_RESELLER");
  }

  return {
    existingCustomer: customerResult.data,
    existingReseller: resellerResult.data,
  };
}

async function generateUniqueResellerSlug(
  admin: SupabaseClient<Database>,
  baseText: string,
  profileId: string,
) {
  const baseSlug = slugify(baseText) || "loja";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await admin
      .from("resellers")
      .select("profile_id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data || data.profile_id === profileId) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function getLatestUserMetadata(
  profileId: string,
  adminClient?: SupabaseClient<Database> | null,
) {
  const admin = adminClient ?? createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const { data, error } = await admin.auth.admin.getUserById(profileId);

  if (error) {
    throw error;
  }

  return data.user?.user_metadata ?? null;
}

export async function getUserContextByProfileId(
  profileId: string,
  adminClient?: SupabaseClient<Database> | null,
): Promise<CurrentUserContext | null> {
  const admin = adminClient ?? createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const [profileResult, ownResellerResult, customerResult] = await Promise.all([
    admin
      .from("profiles")
      .select("id, role, is_active, onboarding_completed")
      .eq("id", profileId)
      .maybeSingle(),
    admin
      .from("resellers")
      .select("id, public_id")
      .eq("profile_id", profileId)
      .maybeSingle(),
    admin
      .from("customers")
      .select("id, reseller_id")
      .eq("profile_id", profileId)
      .maybeSingle(),
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (ownResellerResult.error) {
    throw ownResellerResult.error;
  }

  if (customerResult.error) {
    throw customerResult.error;
  }

  if (!profileResult.data) {
    return null;
  }

  let linkedResellerPublicId: string | null = null;

  if (customerResult.data?.reseller_id) {
    const linkedResellerResult = await admin
      .from("resellers")
      .select("public_id")
      .eq("id", customerResult.data.reseller_id)
      .maybeSingle();

    if (linkedResellerResult.error) {
      throw linkedResellerResult.error;
    }

    linkedResellerPublicId = linkedResellerResult.data?.public_id ?? null;
  }

  return {
    customer_id: customerResult.data?.id ?? null,
    is_active: profileResult.data.is_active,
    linked_reseller_id: customerResult.data?.reseller_id ?? null,
    linked_reseller_public_id: linkedResellerPublicId,
    onboarding_completed: profileResult.data.onboarding_completed,
    profile_id: profileResult.data.id,
    reseller_id: ownResellerResult.data?.id ?? null,
    reseller_public_id: ownResellerResult.data?.public_id ?? null,
    role: profileResult.data.role,
  };
}

export async function repairUserContextFromRecords(
  profileId: string,
  adminClient?: SupabaseClient<Database> | null,
): Promise<CurrentUserContext | null> {
  const admin = adminClient ?? createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const context = await getUserContextByProfileId(profileId, admin);

  if (!context) {
    return null;
  }

  let repairedRole: UserRole | null = context.role;

  if (!repairedRole) {
    if (context.reseller_id) {
      repairedRole = "reseller";
    } else if (context.customer_id && context.linked_reseller_id) {
      repairedRole = "customer";
    }
  }

  const canBeReady =
    (repairedRole === "reseller" && Boolean(context.reseller_id)) ||
    (repairedRole === "customer" &&
      Boolean(context.customer_id) &&
      Boolean(context.linked_reseller_id));

  if (!canBeReady) {
    return context;
  }

  if (
    context.role === repairedRole &&
    context.onboarding_completed &&
    context.is_active
  ) {
    return context;
  }

  const { error } = await admin
    .from("profiles")
    .update({
      is_active: true,
      onboarding_completed: true,
      role: repairedRole,
    })
    .eq("id", profileId);

  if (error) {
    throw error;
  }

  return getUserContextByProfileId(profileId, admin);
}

export async function completeResellerOnboardingWithAdmin(
  input: {
    fullName: string;
    phone?: string | null;
    publicName?: string | null;
    slug?: string | null;
    storeName: string;
  },
  supabase: SupabaseClient<Database>,
) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const user = await getAuthenticatedUser(supabase);
  const fullName = getOptionalString(input.fullName);
  const storeName = getOptionalString(input.storeName);
  const publicName = getOptionalString(input.publicName) ?? storeName;
  const phone = getOptionalString(input.phone);
  const requestedSlug = getOptionalString(input.slug);

  if (!fullName) {
    throw new Error("FULL_NAME_REQUIRED");
  }

  if (!storeName || !publicName) {
    throw new Error("STORE_NAME_REQUIRED");
  }

  await ensureProfileRow(admin, user, fullName, phone);

  const { existingReseller } = await assertProfileCanAssumeRole(admin, user.id, "reseller");
  const normalizedRequestedSlug = requestedSlug ? slugify(requestedSlug) : null;

  let finalSlug: string;

  if (normalizedRequestedSlug) {
    const slugOwnerResult = await admin
      .from("resellers")
      .select("profile_id")
      .eq("slug", normalizedRequestedSlug)
      .maybeSingle();

    if (slugOwnerResult.error) {
      throw slugOwnerResult.error;
    }

    if (slugOwnerResult.data && slugOwnerResult.data.profile_id !== user.id) {
      throw new Error("SLUG_ALREADY_IN_USE");
    }

    finalSlug = normalizedRequestedSlug;
  } else {
    finalSlug =
      existingReseller?.slug ??
      (await generateUniqueResellerSlug(admin, publicName, user.id));
  }

  const profileUpdateResult = await admin
    .from("profiles")
    .update({
      email: user.email?.trim().toLowerCase() ?? null,
      full_name: fullName,
      is_active: true,
      onboarding_completed: true,
      phone,
      role: "reseller",
    })
    .eq("id", user.id);

  if (profileUpdateResult.error) {
    throw profileUpdateResult.error;
  }

  const resellerUpsertResult = await admin.from("resellers").upsert(
    {
      is_public: true,
      profile_id: user.id,
      public_name: publicName,
      search_name: normalizeSearchText(publicName),
      slug: finalSlug,
      status: "active",
      store_name: storeName,
    },
    { onConflict: "profile_id" },
  );

  if (resellerUpsertResult.error) {
    throw resellerUpsertResult.error;
  }

  const context = await getUserContextByProfileId(user.id, admin);

  if (!context) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return context;
}

export async function completeCustomerOnboardingWithAdmin(
  input: {
    fullName: string;
    phone?: string | null;
    resellerPublicId: string;
  },
  supabase: SupabaseClient<Database>,
) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const user = await getAuthenticatedUser(supabase);
  const fullName = getOptionalString(input.fullName);
  const phone = getOptionalString(input.phone);
  const resellerPublicId = getOptionalString(input.resellerPublicId);

  if (!fullName) {
    throw new Error("FULL_NAME_REQUIRED");
  }

  if (!resellerPublicId) {
    throw new Error("RESELLER_REQUIRED");
  }

  await ensureProfileRow(admin, user, fullName, phone);

  const { existingCustomer } = await assertProfileCanAssumeRole(admin, user.id, "customer");
  const selectedResellerResult = await admin
    .from("resellers")
    .select("id")
    .eq("public_id", resellerPublicId)
    .eq("is_public", true)
    .eq("status", "active")
    .maybeSingle();

  if (selectedResellerResult.error) {
    throw selectedResellerResult.error;
  }

  if (!selectedResellerResult.data) {
    throw new Error("RESELLER_NOT_FOUND_OR_UNAVAILABLE");
  }

  if (
    existingCustomer?.reseller_id &&
    existingCustomer.reseller_id !== selectedResellerResult.data.id
  ) {
    throw new Error("CUSTOMER_ALREADY_LINKED_TO_ANOTHER_RESELLER");
  }

  const profileUpdateResult = await admin
    .from("profiles")
    .update({
      email: user.email?.trim().toLowerCase() ?? null,
      full_name: fullName,
      is_active: true,
      onboarding_completed: true,
      phone,
      role: "customer",
    })
    .eq("id", user.id);

  if (profileUpdateResult.error) {
    throw profileUpdateResult.error;
  }

  const customerUpsertResult = await admin.from("customers").upsert(
    {
      profile_id: user.id,
      reseller_id: selectedResellerResult.data.id,
    },
    { onConflict: "profile_id" },
  );

  if (customerUpsertResult.error) {
    throw customerUpsertResult.error;
  }

  const context = await getUserContextByProfileId(user.id, admin);

  if (!context) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return context;
}
