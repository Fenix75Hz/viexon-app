import { redirect } from "next/navigation";

import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    redirect("/login?erro=Preencha%20as%20variaveis%20publicas%20do%20Supabase%20para%20continuar.");
  }

  await redirectByRole();

  return null;
}
