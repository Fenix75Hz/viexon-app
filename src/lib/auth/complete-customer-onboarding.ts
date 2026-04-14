import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext } from "@/types/database";

type CompleteCustomerOnboardingInput = {
  fullName: string;
  phone?: string | null;
  resellerPublicId: string;
};

export async function completeCustomerOnboarding(
  input: CompleteCustomerOnboardingInput,
): Promise<CurrentUserContext> {
  const supabase = await createSupabaseServerClient();
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
