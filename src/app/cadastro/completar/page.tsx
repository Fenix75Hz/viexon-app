import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthUnavailableState } from "@/components/auth/auth-unavailable-state";
import { AuthShell } from "@/components/auth/auth-shell";
import { InlineMessage } from "@/components/auth/form-primitives";
import { getFriendlyAuthErrorMessage } from "@/lib/auth/map-auth-error-message";
import {
  getAuthenticatedUser,
  getCurrentUserContext,
} from "@/lib/auth/get-current-user-role";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Viexon | Recuperar cadastro",
  description: "Pagina de contingencia para cadastros que nao puderam ser finalizados automaticamente.",
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
        badge="Recuperacao"
        title="O ambiente precisa estar consistente para validar o acesso."
        description="Esta tela agora existe apenas como contingencia. O cadastro principal ja deve liberar o perfil sem uma segunda etapa manual."
        sideLabel="Fluxo protegido"
        sideTitle="Quando algo sair do trilho, a recuperacao precisa ser objetiva."
        highlights={[
          "O cadastro principal concentra todos os dados do perfil em uma unica etapa.",
          "A confirmacao de e-mail deve concluir o acesso automaticamente.",
          "Esta tela so aparece quando o callback nao consegue finalizar o perfil.",
        ]}
      >
        <AuthUnavailableState message={envStatus.message} />
      </AuthShell>
    );
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  let resolutionError: string | null = null;

  try {
    const context = await getCurrentUserContext();

    if (context?.role && context.onboarding_completed) {
      redirect("/auth/redirecionar");
    }
  } catch (error) {
    resolutionError = getFriendlyAuthErrorMessage(error);
  }

  const { erro } = await searchParams;
  const message =
    erro ??
    resolutionError ??
    "Seu cadastro nao foi finalizado automaticamente. Encerre a sessao e tente entrar novamente. Se o link expirou, gere um novo cadastro.";

  return (
    <AuthShell
      badge="Recuperacao"
      title="O perfil nao foi liberado automaticamente."
      description="O fluxo principal agora conclui o perfil direto no cadastro. Se voce chegou aqui, houve uma inconsistência no callback ou nos dados salvos no Auth."
      sideLabel="Ajuste seguro"
      sideTitle="Nada de segunda ficha manual. Aqui existe apenas uma saida limpa para recuperar o acesso."
      highlights={[
        "O formulario de cadastro ja envia os dados completos do perfil.",
        "A confirmacao por e-mail deveria levar direto ao ambiente correto.",
        "Se houve erro, encerre a sessao e tente entrar de novo antes de refazer o cadastro.",
      ]}
    >
      <div className="space-y-6">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Recuperar acesso
          </p>
          <h2 className="font-display mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.35rem]">
            O Viexon nao vai pedir seu perfil duas vezes.
          </h2>
          <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Esta area deixou de ser uma etapa de preenchimento. Ela so informa que o cadastro atual
            ficou inconsistente e precisa ser retomado com a sessao limpa.
          </p>
        </div>

        <InlineMessage message={message} tone="error" />

        <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
            Proximo passo
          </p>
          <p className="font-display mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Encerre a sessao atual e tente entrar novamente.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            Isso limpa a sessao atual, evita loops de redirect e permite que o login conclua o
            perfil automaticamente se o banco e o callback ja estiverem consistentes. Se o link de
            confirmacao expirou, refaca o cadastro para gerar um novo envio.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/auth/signout?next=/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] via-[#86efff] to-[var(--accent-secondary)] px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_22px_58px_var(--accent-glow)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_76px_var(--accent-glow)]"
            >
              Sair e tentar login
            </Link>

            <Link
              href="/auth/signout?next=/criar-conta"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-[border-color,background-color] duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
            >
              Sair e refazer cadastro
            </Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
