"use client"

import { AuthPanel } from "@/components/auth/auth-panel"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Hero } from "@/components/ui/animated-hero"

export function LandingShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,208,255,0.18),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(43,111,255,0.15),transparent_30%),linear-gradient(180deg,rgba(5,10,24,0.92),rgba(3,7,18,1))] dark:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(166,224,255,0.45),transparent_32%),radial-gradient(circle_at_82%_16%,rgba(241,199,214,0.32),transparent_26%),linear-gradient(180deg,rgba(252,247,244,0.98),rgba(246,239,235,1))] dark:hidden" />
        <div className="absolute left-[8%] top-18 h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl dark:bg-cyan-400/20" />
        <div className="absolute bottom-16 right-[12%] h-72 w-72 rounded-full bg-blue-500/12 blur-3xl dark:bg-blue-500/20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-12 pt-6 md:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-slate-950 text-lg font-semibold tracking-[0.18em] text-cyan-100 shadow-[0_14px_30px_-18px_rgba(0,183,255,0.8)] dark:border-cyan-300/15 dark:bg-white/6 dark:text-white">
              V
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-slate-800 dark:text-cyan-50">
                VIEXON
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-cyan-100/55">
                Gestao premium para atacado
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <section className="grid flex-1 items-center gap-10 pb-6 lg:grid-cols-[minmax(0,1.2fr)_430px] lg:gap-12">
          <Hero />
          <AuthPanel />
        </section>
      </div>
    </main>
  )
}
