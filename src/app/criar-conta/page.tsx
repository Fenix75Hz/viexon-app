import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthUnavailableState } from "@/components/auth/auth-unavailable-state";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getAuthenticatedUser } from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Criar conta",
  description:
    "Crie sua conta no Viexon como revendedora ou cliente com onboarding conectado ao Supabase.",
};

export const dynamic = "force-dynamic";

export default async function CriarContaPage() {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return (
      <AuthShell
        badge="Cadastro"
        title="Crie seu acesso com o tipo certo desde o primeiro passo."
        description="O cadastro ja conversa com a estrutura existente do Supabase. Revendedoras concluem o proprio perfil. Clientes so avancam depois de selecionar a revendedora correta."
        sideLabel="Onboarding conectado"
        sideTitle="Uma entrada premium, clara e alinhada com a arquitetura que ja existe."
        highlights={[
          "Fluxo dedicado para revendedora, incluindo perfil comercial e nome da loja.",
          "Fluxo dedicado para cliente, com busca de revendedora e vinculacao obrigatoria.",
          "Validacoes no formulario e no backend para evitar cadastro inconsistente ou sem contexto.",
        ]}
      >
        <AuthUnavailableState message={envStatus.message} />
      </AuthShell>
    );
  }

  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/auth/redirecionar");
  }

  return (
    <AuthShell
      badge="Cadastro"
      title="Crie seu acesso com o tipo certo desde o primeiro passo."
      description="O cadastro ja conversa com a estrutura existente do Supabase. Revendedoras concluem o proprio perfil. Clientes so avancam depois de selecionar a revendedora correta."
      sideLabel="Onboarding conectado"
      sideTitle="Uma entrada premium, clara e alinhada com a arquitetura que ja existe."
      highlights={[
        "Fluxo dedicado para revendedora, incluindo perfil comercial e nome da loja.",
        "Fluxo dedicado para cliente, com busca de revendedora e vinculacao obrigatoria.",
        "Validacoes no formulario e no backend para evitar cadastro inconsistente ou sem contexto.",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
