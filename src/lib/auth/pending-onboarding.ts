import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext, Database, UserRole } from "@/types/database";

import { completeCustomerOnboarding } from "./complete-customer-onboarding";
import { completeResellerOnboarding } from "./complete-reseller-onboarding";
import {
  getLatestUserMetadata,
  getUserContextByProfileId,
  repairUserContextFromRecords,
} from "./onboarding-admin";

type PendingOnboardingMetadata = {
  account_type: UserRole;
  full_name: string;
  phone?: string | null;
  reseller_public_id?: string | null;
  store_name?: string | null;
};

type PendingOnboardingValues = {
  accountType: UserRole;
  fullName: string;
  phone?: string | null;
  resellerPublicId?: string | null;
  storeName?: string | null;
};

export type PendingOnboardingResolution =
  | {
      status: "completed" | "ready";
      context: CurrentUserContext;
    }
  | {
      status: "missing-metadata" | "signed-out";
    };

function getOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isUserRole(value: unknown): value is UserRole {
  return value === "reseller" || value === "customer";
}

async function getCurrentContext(
  supabase: SupabaseClient<Database>,
): Promise<CurrentUserContext | null> {
  const { data, error } = await supabase.rpc("get_my_user_context");

  if (error) {
    throw error;
  }

  return data[0] ?? null;
}

export function buildPendingOnboardingMetadata(
  values: PendingOnboardingValues,
): PendingOnboardingMetadata {
  return {
    account_type: values.accountType,
    full_name: values.fullName.trim(),
    phone: getOptionalString(values.phone),
    reseller_public_id: getOptionalString(values.resellerPublicId),
    store_name: getOptionalString(values.storeName),
  };
}

export function readPendingOnboardingMetadata(rawMetadata: unknown): PendingOnboardingMetadata | null {
  if (!rawMetadata || typeof rawMetadata !== "object" || Array.isArray(rawMetadata)) {
    return null;
  }

  const metadata = rawMetadata as Record<string, unknown>;
  const accountType = metadata.account_type;
  const fullName = getOptionalString(metadata.full_name);
  const phone = getOptionalString(metadata.phone);
  const resellerPublicId = getOptionalString(metadata.reseller_public_id);
  const storeName = getOptionalString(metadata.store_name);

  if (!isUserRole(accountType) || !fullName) {
    return null;
  }

  if (accountType === "reseller" && !storeName) {
    return null;
  }

  if (accountType === "customer" && !resellerPublicId) {
    return null;
  }

  return {
    account_type: accountType,
    full_name: fullName,
    phone,
    reseller_public_id: resellerPublicId,
    store_name: storeName,
  };
}

export async function completePendingOnboardingFromMetadata(
  metadata: PendingOnboardingMetadata,
  supabaseClient?: SupabaseClient<Database>,
): Promise<CurrentUserContext> {
  const supabase = supabaseClient ?? (await createSupabaseServerClient());

  if (metadata.account_type === "reseller") {
    return completeResellerOnboarding(
      {
        fullName: metadata.full_name,
        phone: metadata.phone,
        storeName: metadata.store_name ?? "",
      },
      supabase,
    );
  }

  return completeCustomerOnboarding(
    {
      fullName: metadata.full_name,
      phone: metadata.phone,
      resellerPublicId: metadata.reseller_public_id ?? "",
    },
    supabase,
  );
}

export async function resolvePendingOnboarding(
  supabaseClient?: SupabaseClient<Database>,
  currentUser?: User | null,
): Promise<PendingOnboardingResolution> {
  const supabase = supabaseClient ?? (await createSupabaseServerClient());
  let user = currentUser ?? null;

  if (!user) {
    const {
      data: { user: authenticatedUser },
    } = await supabase.auth.getUser();

    user = authenticatedUser;
  }

  if (!user) {
    return { status: "signed-out" };
  }

  const currentContext = await getCurrentContext(supabase);

  if (currentContext?.role && currentContext.onboarding_completed && currentContext.is_active) {
    return {
      status: "ready",
      context: currentContext,
    };
  }

  const repairedContext = await repairUserContextFromRecords(user.id);

  if (repairedContext?.role && repairedContext.onboarding_completed && repairedContext.is_active) {
    return {
      status: "ready",
      context: repairedContext,
    };
  }

  let metadata = readPendingOnboardingMetadata(user.user_metadata);

  if (!metadata) {
    metadata = readPendingOnboardingMetadata(await getLatestUserMetadata(user.id));
  }

  if (!metadata) {
    const adminContext = await getUserContextByProfileId(user.id);

    if (adminContext?.role && adminContext.onboarding_completed && adminContext.is_active) {
      return {
        status: "ready",
        context: adminContext,
      };
    }

    return { status: "missing-metadata" };
  }

  return {
    status: "completed",
    context: await completePendingOnboardingFromMetadata(metadata, supabase),
  };
}

export function getPendingOnboardingFallbackMessage(status: PendingOnboardingResolution["status"]) {
  switch (status) {
    case "missing-metadata":
      return "Seu cadastro ficou sem os dados do perfil. Saia da conta e refaca o cadastro.";
    case "signed-out":
      return "Sua sessao expirou. Entre novamente para continuar.";
    default:
      return "Nao foi possivel liberar seu acesso agora. Tente novamente em instantes.";
  }
}
