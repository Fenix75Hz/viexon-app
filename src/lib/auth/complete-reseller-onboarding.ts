import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext, Database } from "@/types/database";

type CompleteResellerOnboardingInput = {
  fullName: string;
  phone?: string | null;
  publicName?: string | null;
  slug?: string | null;
  storeName: string;
};

export async function completeResellerOnboarding(
  input: CompleteResellerOnboardingInput,
  supabaseClient?: SupabaseClient<Database>,
): Promise<CurrentUserContext> {
  const supabase = supabaseClient ?? (await createSupabaseServerClient());
  const { data, error } = await supabase.rpc("complete_reseller_onboarding", {
    p_full_name: input.fullName,
    p_phone: input.phone ?? null,
    p_public_name: input.publicName ?? null,
    p_slug: input.slug ?? null,
    p_store_name: input.storeName,
  });

  if (error) {
    throw error;
  }

  const context = data[0];

  if (!context) {
    throw new Error("Reseller onboarding did not return user context.");
  }

  return context;
}
