import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthUnavailableState } from "@/components/auth/auth-unavailable-state";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUserContext } from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Completar cadastro",
  description: "Finalize seu perfil no Viexon para liberar o acesso completo na plataforma.",
};

export const dynamic = "force-dynamic";

type CompleteRegistrationPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

export default async function CompleteRegistrationPage({
  searchParams,
}: CompleteRegistrationPageProps) {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return (
      <AuthShell
        badge="Finalizacao"
        title="Conclua seu perfil para liberar a experiencia completa."
        description="Sua conta ja esta autenticada. Falta apenas registrar o perfil correto para que o Viexon aplique as regras de acesso, vinculos e destinos privados sem improviso."
        sideLabel="Ultimo passo"
        sideTitle="O acesso definitivo depende do perfil certo e do vinculo correto."
        highlights={[
          "Revendedoras concluem o perfil comercial e ativam sua area principal.",
          "Clientes precisam selecionar uma revendedora valida antes de finalizar o cadastro.",
          "O redirecionamento final respeita o contexto salvo no banco e nao depende apenas do frontend.",
        ]}
      >
        <AuthUnavailableState message={envStatus.message} />
      </AuthShell>
    );
  }

  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  if (context.role && context.onboarding_completed) {
    redirect("/auth/redirecionar");
  }

  const { erro } = await searchParams;

  return (
    <AuthShell
      badge="Finalizacao"
      title="Conclua seu perfil para liberar a experiencia completa."
      description="Sua conta ja esta autenticada. Falta apenas registrar o perfil correto para que o Viexon aplique as regras de acesso, vinculos e destinos privados sem improviso."
      sideLabel="Ultimo passo"
      sideTitle="O acesso definitivo depende do perfil certo e do vinculo correto."
      highlights={[
        "Revendedoras concluem o perfil comercial e ativam sua area principal.",
        "Clientes precisam selecionar uma revendedora valida antes de finalizar o cadastro.",
        "O redirecionamento final respeita o contexto salvo no banco e nao depende apenas do frontend.",
      ]}
    >
      <RegisterForm mode="complete" initialMessage={erro ?? null} />
    </AuthShell>
  );
}
