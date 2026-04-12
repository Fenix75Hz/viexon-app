"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react"

import { AuthPanel } from "@/components/auth/auth-panel"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function AuthShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(76,219,255,0.18),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(28,88,255,0.12),transparent_22%),linear-gradient(180deg,#040a1a_0%,#040d23_48%,#030817_100%)] dark:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(159,224,255,0.38),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(239,201,212,0.24),transparent_20%),linear-gradient(180deg,#fdf9f4_0%,#f7f1ea_48%,#f1ebe4_100%)] dark:hidden" />
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-cyan-400/14 blur-[150px] dark:bg-cyan-400/20" />
        <div className="absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-blue-500/10 blur-[180px] dark:bg-blue-500/16" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <header className="mb-10">
          <div className="flex items-center justify-between rounded-[26px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-2xl dark:border-white/8 dark:bg-white/4 sm:px-5">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              <ArrowLeft className="size-4" />
              Voltar para a landing
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600 dark:text-cyan-100/72">
              <ShieldCheck className="size-3.5" />
              Autenticacao Viexon
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-cyan-100/55">
                Acesso premium ao sistema
              </p>
              <h1 className="max-w-[11ch] text-[clamp(3rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.05em] text-slate-950 dark:text-white">
                Entre para operar com mais clareza e presenca.
              </h1>
              <p className="max-w-[60ch] text-[15px] leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                O acesso do Viexon foi separado da landing para deixar a experiencia
                institucional mais limpa e a autenticacao mais coerente com um
                software premium real.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
                <Sparkles className="size-5 text-cyan-600 dark:text-cyan-300" />
                <h2 className="mt-4 text-[1.9rem] leading-none text-slate-950 dark:text-white">
                  Entrar
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Acesse sua operacao, acompanhe contexto comercial e siga para os
                  proximos modulos do sistema.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
                <ShieldCheck className="size-5 text-cyan-600 dark:text-cyan-300" />
                <h2 className="mt-4 text-[1.9rem] leading-none text-slate-950 dark:text-white">
                  Criar conta
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Inicie a base do seu acesso com um fluxo mais elegante, claro e
                  alinhado ao posicionamento do Viexon.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AuthPanel />
          </div>
        </section>
      </div>
    </main>
  )
}
