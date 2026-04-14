import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProtectedAreaShell } from "@/components/auth/protected-area-shell";
import { getCurrentUserContext } from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Area da revendedora",
  description: "Destino inicial da revendedora apos autenticacao no Viexon.",
};

export const dynamic = "force-dynamic";

export default async function RevendedoraPage() {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    redirect("/login?erro=Preencha%20as%20variaveis%20publicas%20do%20Supabase%20para%20continuar.");
  }

  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  if (!context.is_active) {
    redirect("/login");
  }

  if (!context.role || !context.onboarding_completed) {
    redirect("/cadastro/completar");
  }

  if (context.role !== "reseller") {
    redirect("/cliente");
  }

  return (
    <ProtectedAreaShell
      context={context}
      eyebrow="Area principal"
      title="Bem-vinda a area da revendedora."
      description="Este destino confirma que o login, a identificacao do perfil e o redirecionamento automatico estao funcionando com a estrutura real do projeto."
    />
  );
}
