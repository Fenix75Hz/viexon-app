import type { ReactNode } from "react";

import { siteNavigationItems } from "@/components/site/navigation";
import { SiteHeader } from "@/components/site/site-header";

type AuthShellProps = {
  badge: string;
  children: ReactNode;
  description: string;
  highlights: string[];
  sideLabel: string;
  sideTitle: string;
  title: string;
};

export function AuthShell({
  badge,
  children,
  description,
  highlights,
  sideLabel,
  sideTitle,
  title,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(100,231,255,0.16),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(33,111,255,0.2),transparent_26%),radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.05),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px)",
          backgroundSize: "92px 92px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 88%)",
        }}
      />

      <SiteHeader
        navigationItems={siteNavigationItems}
        loginHref="/login"
        primaryHref="/criar-conta"
        wrapperClassName="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8"
      />

      <section className="relative px-5 pb-14 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1360px] gap-10 pt-16 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center">
          <div className="max-w-[37rem]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl">
              {badge}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              Acesso premium
            </div>

            <h1 className="font-display mt-8 text-balance text-[clamp(3rem,6.2vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
              {title}
            </h1>

            <p className="mt-6 max-w-[34rem] text-pretty text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              {description}
            </p>

            <div className="mt-10 overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_32px_96px_var(--shadow-strong)] backdrop-blur-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                {sideLabel}
              </p>
              <p className="font-display mt-4 text-[1.8rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {sideTitle}
              </p>

              <div className="mt-8 grid gap-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-[12%] top-[-6%] h-44 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 72%)",
              }}
            />
            <div className="relative overflow-hidden rounded-[38px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 shadow-[0_40px_120px_var(--shadow-strong)] backdrop-blur-2xl sm:p-6">
              <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 sm:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
