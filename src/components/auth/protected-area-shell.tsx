import Link from "next/link";

import { ViexonLogo } from "@/components/landing/viexon-logo";
import type { CurrentUserContext } from "@/types/database";

type ProtectedAreaShellProps = {
  context: CurrentUserContext;
  description: string;
  eyebrow: string;
  title: string;
};

export function ProtectedAreaShell({
  context,
  description,
  eyebrow,
  title,
}: ProtectedAreaShellProps) {
  const secondaryText =
    context.role === "reseller"
      ? context.reseller_public_id
        ? `Identificador publico: ${context.reseller_public_id}`
        : "Perfil de revendedora ativo."
      : context.linked_reseller_public_id
        ? `Revendedora vinculada: ${context.linked_reseller_public_id}`
        : "Perfil de cliente ativo.";

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-14 pt-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(100,231,255,0.15),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(33,111,255,0.18),transparent_26%)]"
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-5 py-4 shadow-[0_24px_80px_var(--shadow-soft)] backdrop-blur-2xl">
          <Link href="/" aria-label="Viexon">
            <ViexonLogo />
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              {context.role === "reseller" ? "Revendedora" : "Cliente"}
            </span>
            <Link
              href="/"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-[border-color,background-color] duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Voltar ao site
            </Link>
          </div>
        </div>

        <section className="grid gap-8 pt-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center">
          <div className="max-w-[38rem]">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
              {eyebrow}
            </p>
            <h1 className="font-display mt-6 text-balance text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
              {title}
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-8 text-[var(--text-secondary)]">
              {description}
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 shadow-[0_40px_120px_var(--shadow-strong)] backdrop-blur-2xl">
            <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                    Status
                  </p>
                  <p className="font-display mt-3 text-[1.6rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    Acesso liberado
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    Seu fluxo de autenticacao esta ativo e o redirecionamento por perfil foi concluido.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                    Contexto
                  </p>
                  <p className="font-display mt-3 text-[1.2rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {context.profile_id}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{secondaryText}</p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 text-sm leading-7 text-[var(--text-secondary)]">
                Esta area funciona como destino inicial seguro para o fluxo de auth. Quando o restante
                do produto evoluir, a navegacao privada pode crescer a partir desta base sem quebrar o
                redirecionamento atual.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
