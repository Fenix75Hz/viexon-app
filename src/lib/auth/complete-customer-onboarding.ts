import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext, Database } from "@/types/database";

import { completeCustomerOnboardingWithAdmin } from "./onboarding-admin";

type CompleteCustomerOnboardingInput = {
  fullName: string;
  phone?: string | null;
  resellerPublicId: string;
};

export async function completeCustomerOnboarding(
  input: CompleteCustomerOnboardingInput,
  supabaseClient?: SupabaseClient<Database>,
): Promise<CurrentUserContext> {
  const supabase = supabaseClient ?? (await createSupabaseServerClient());
  const adminContext = await completeCustomerOnboardingWithAdmin(input, supabase);

  if (adminContext) {
    return adminContext;
  }

  const { data, error } = await supabase.rpc("complete_customer_onboarding", {
    p_full_name: input.fullName,
    p_phone: input.phone ?? null,
    p_reseller_public_id: input.resellerPublicId,
  });

  if (error) {
    throw error;
  }

  const context = data[0];

  if (!context) {
    throw new Error("Customer onboarding did not return user context.");
  }

  return context;
}
