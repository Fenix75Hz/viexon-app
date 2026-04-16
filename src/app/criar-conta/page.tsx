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
    "Crie sua conta de cliente no Viexon com vinculacao direta a uma revendedora existente.",
};

export const dynamic = "force-dynamic";

export default async function CriarContaPage() {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return (
      <AuthShell
        badge="Cadastro"
        title="O cadastro publico agora atende apenas clientes."
        description="A revendedora passa a ser provisionada manualmente no Supabase. Aqui o app cria apenas acessos de clientes vinculados a uma revendedora ativa."
        sideLabel="Fluxo simplificado"
        sideTitle="Menos variacao no cadastro, menos margem para inconsistencias no login."
        highlights={[
          "Somente clientes podem criar conta por esta tela.",
          "Revendedoras passam a ser liberadas manualmente no Supabase.",
          "O cliente so conclui o cadastro depois de selecionar a revendedora correta.",
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
      title="O cadastro publico agora atende apenas clientes."
      description="A revendedora passa a ser provisionada manualmente no Supabase. Aqui o app cria apenas acessos de clientes vinculados a uma revendedora ativa."
      sideLabel="Fluxo simplificado"
      sideTitle="Menos variacao no cadastro, menos margem para inconsistencias no login."
      highlights={[
        "Somente clientes podem criar conta por esta tela.",
        "Revendedoras passam a ser liberadas manualmente no Supabase.",
        "O cliente so conclui o cadastro depois de selecionar a revendedora correta.",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
