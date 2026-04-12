"use client"

import { AuthPanel } from "@/components/auth/auth-panel"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Hero } from "@/components/ui/animated-hero"

export function LandingShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(72,214,255,0.22),transparent_24%),radial-gradient(circle_at_78%_20%,rgba(32,99,255,0.12),transparent_26%),linear-gradient(180deg,rgba(5,10,24,0.97),rgba(2,8,23,1))] dark:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(160,224,255,0.48),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(235,198,212,0.3),transparent_24%),linear-gradient(180deg,rgba(252,248,244,0.98),rgba(245,238,233,1))] dark:hidden" />
        <div className="absolute left-[5%] top-[9%] h-72 w-72 rounded-full bg-cyan-400/14 blur-[120px] dark:bg-cyan-400/18" />
        <div className="absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-blue-500/12 blur-[140px] dark:bg-blue-500/18" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/28 to-transparent dark:via-cyan-300/12" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 pt-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <header className="mb-8 flex items-start justify-between gap-6 lg:mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300/35 bg-slate-950/85 text-lg font-semibold tracking-[0.18em] text-cyan-100 shadow-[0_14px_30px_-18px_rgba(0,183,255,0.42)] dark:border-cyan-300/15 dark:bg-white/6 dark:text-white">
              V
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-cyan-50">
                VIEXON
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                Gestao premium para atacado e consignado
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <section className="grid flex-1 items-center gap-8 pb-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 xl:grid-cols-[minmax(0,1.08fr)_440px] xl:gap-12">
          <Hero />
          <div className="flex justify-center lg:justify-end">
            <AuthPanel />
          </div>
        </section>
      </div>
    </main>
  )
}
