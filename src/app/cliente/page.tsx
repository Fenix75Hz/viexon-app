import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProtectedAreaShell } from "@/components/auth/protected-area-shell";
import { getCurrentUserContext } from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Area do cliente",
  description: "Destino inicial do cliente apos autenticacao no Viexon.",
};

export const dynamic = "force-dynamic";

export default async function ClientePage() {
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

  if (context.role !== "customer") {
    redirect("/revendedora");
  }

  return (
    <ProtectedAreaShell
      context={context}
      eyebrow="Area do cliente"
      title="Seu acesso foi direcionado para o ambiente correto."
      description="Este destino valida o fluxo de login unico com leitura automatica do perfil salvo no banco e preserva o vinculo com a revendedora selecionada."
    />
  );
}
