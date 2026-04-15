import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthUnavailableState } from "@/components/auth/auth-unavailable-state";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUserContext } from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Login",
  description: "Entre no Viexon com autenticacao integrada ao Supabase e redirecionamento por perfil.",
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return (
      <AuthShell
        badge="Acesso"
        title="Entre no Viexon e retome a operacao sem atrito."
        description="O login e unico. Depois de autenticar, a plataforma identifica seu perfil, valida o contexto salvo no banco e encaminha voce para a rota correta."
        sideLabel="Fluxo protegido"
        sideTitle="Autenticacao ligada a perfis, onboarding e redirecionamento real."
        highlights={[
          "Login unico para revendedoras e clientes, com leitura automatica do papel salvo no banco.",
          "Feedback claro de erro, loading state e tratamento coerente com os fluxos do Supabase.",
          "Base pronta para crescer sem duplicar auth, regras de negocio ou redirecionamento.",
        ]}
      >
        <AuthUnavailableState message={envStatus.message} />
      </AuthShell>
    );
  }

  const context = await getCurrentUserContext();

  if (context) {
    redirect("/auth/redirecionar");
  }

  const { erro } = await searchParams;

  return (
    <AuthShell
      badge="Acesso"
      title="Entre no Viexon e retome a operacao sem atrito."
      description="O login e unico. Depois de autenticar, a plataforma identifica seu perfil, valida o contexto salvo no banco e encaminha voce para a rota correta."
      sideLabel="Fluxo protegido"
      sideTitle="Autenticacao ligada a perfis, onboarding e redirecionamento real."
      highlights={[
        "Login unico para revendedoras e clientes, com leitura automatica do papel salvo no banco.",
        "Feedback claro de erro, loading state e tratamento coerente com os fluxos do Supabase.",
        "Base pronta para crescer sem duplicar auth, regras de negocio ou redirecionamento.",
      ]}
    >
      <LoginForm initialMessage={erro ?? null} />
    </AuthShell>
  );
}
