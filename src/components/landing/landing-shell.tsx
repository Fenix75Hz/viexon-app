"use client"

import { AuthPanel } from "@/components/auth/auth-panel"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Hero } from "@/components/ui/animated-hero"

export function LandingShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(70,218,255,0.18),transparent_26%),radial-gradient(circle_at_78%_16%,rgba(22,97,255,0.14),transparent_24%),linear-gradient(180deg,#040a1c_0%,#040d22_42%,#020817_100%)] dark:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(156,220,255,0.38),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(239,202,212,0.24),transparent_22%),linear-gradient(180deg,#fcf8f3_0%,#f6f0e9_45%,#f1ebe4_100%)] dark:hidden" />
        <div className="absolute left-[4%] top-[8%] h-80 w-80 rounded-full bg-cyan-400/14 blur-[150px] dark:bg-cyan-400/20" />
        <div className="absolute bottom-[6%] right-[6%] h-96 w-96 rounded-full bg-blue-500/10 blur-[180px] dark:bg-blue-500/16" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-cyan-300/12" />
        <div className="absolute inset-y-0 left-[48%] hidden w-px bg-gradient-to-b from-transparent via-white/8 to-transparent lg:block dark:via-white/6" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 pb-10 pt-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <header className="mb-8 lg:mb-10">
          <div className="mx-auto flex w-full items-center justify-between rounded-[28px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-2xl dark:border-white/8 dark:bg-white/4 sm:px-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300/35 bg-slate-950/88 text-lg font-semibold tracking-[0.18em] text-cyan-100 shadow-[0_14px_30px_-18px_rgba(0,183,255,0.42)] dark:border-cyan-300/15 dark:bg-white/6 dark:text-white">
                V
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.34em] text-slate-900 dark:text-cyan-50">
                  VIEXON
                </p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-cyan-100/55">
                  Gestao premium para atacado e consignado
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 pb-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,430px)] lg:gap-10 xl:gap-16">
          <Hero />

          <div className="flex flex-col gap-5 lg:items-end">
            <div className="hidden w-full max-w-[430px] grid-cols-2 gap-3 lg:grid">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                  Operacao
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                  360°
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Pedidos, estoque e financeiro em sincronia.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                  Equipe
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                  B2B
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Interface pensada para rotina comercial profissional.
                </p>
              </div>
            </div>

            <AuthPanel />

            <div className="hidden w-full max-w-[430px] rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl dark:border-white/8 dark:bg-white/4 lg:block">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                Posicionamento
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                O Viexon nasce para substituir planilhas, improvisos e visoes
                fragmentadas por uma operacao clara, premium e comercialmente
                forte.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
