"use client"

import Link from "next/link"
import { animate, set, stagger } from "animejs"
import { ArrowRight, BadgeDollarSign, Boxes, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { AnimatedHeroWord } from "@/components/ui/animated-hero"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    title: "Pedidos mais claros",
    description: "Da entrada do pedido ao fechamento comercial, tudo respira organizacao.",
    icon: Boxes,
  },
  {
    title: "Consignado com contexto",
    description: "Reposicao, repasse e giro operando na mesma leitura de negocio.",
    icon: Sparkles,
  },
  {
    title: "Financeiro inteligente",
    description: "Margem, fluxo e performance comercial com visao executiva real.",
    icon: BadgeDollarSign,
  },
]

const productPillars = [
  "Atacado, consignado e equipe comercial em um unico ecossistema.",
  "Visao premium para operacoes que precisam crescer sem improviso.",
  "Base pensada para transformar rotina operacional em vantagem competitiva.",
]

const metrics = [
  { label: "Operacao conectada", value: "360°" },
  { label: "Leitura comercial", value: "B2B" },
  { label: "Visibilidade", value: "24h" },
]

export function LandingShell() {
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!pageRef.current) {
      return
    }

    const revealTargets = pageRef.current.querySelectorAll("[data-reveal]")

    set(revealTargets, {
      opacity: 0,
      translateY: 28,
    })

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [28, 0],
      delay: stagger(90),
      duration: 920,
      easing: "easeOutExpo",
    })
  }, [])

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(76,219,255,0.18),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(28,88,255,0.12),transparent_22%),linear-gradient(180deg,#040a1a_0%,#050d24_45%,#030817_100%)] dark:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(159,224,255,0.4),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(239,201,212,0.22),transparent_20%),linear-gradient(180deg,#fdf9f4_0%,#f7f1ea_48%,#f1ebe4_100%)] dark:hidden" />
        <div className="absolute left-[4%] top-[8%] h-80 w-80 rounded-full bg-cyan-400/16 blur-[150px] dark:bg-cyan-400/22" />
        <div className="absolute right-[6%] top-[26%] h-72 w-72 rounded-full bg-blue-500/10 blur-[150px] dark:bg-blue-500/16" />
        <div className="absolute bottom-[4%] left-[20%] h-72 w-72 rounded-full bg-sky-200/18 blur-[150px] dark:bg-cyan-500/8" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-4 pb-14 pt-4 sm:px-6 lg:px-8 xl:px-10">
        <header data-reveal className="mb-10">
          <div className="flex items-center justify-between rounded-[26px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-2xl dark:border-white/8 dark:bg-white/4 sm:px-5">
            <Link href="/" className="flex items-center gap-4">
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
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="hidden text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white sm:inline-flex"
              >
                Entrar
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="grid items-center gap-10 pb-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,460px)] lg:gap-14">
          <div data-reveal className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600 dark:text-cyan-100/72">
              <Sparkles className="size-3.5" />
              Landing institucional do Viexon
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-slate-500 dark:text-cyan-100/60">
                Software premium para operacao comercial
              </p>

              <h1 className="max-w-[10ch] text-[clamp(3.4rem,7.8vw,6.6rem)] leading-[0.9] tracking-[-0.055em] text-slate-950 dark:text-white">
                Gestao premium para atacado, consignado e <AnimatedHeroWord />
              </h1>

              <p className="max-w-[58ch] text-[15px] leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                O Viexon nasce para estruturar pedidos, estoque, clientes,
                revendedoras e financeiro em uma experiencia elegante, confiavel e
                comercialmente forte.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 min-w-[188px] rounded-full px-6">
                <Link href="/auth">
                  Entrar no Viexon
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 min-w-[170px] rounded-full border-white/12 bg-white/36 px-6 dark:bg-white/5"
              >
                <Link href="/auth">Criar conta</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {productPillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-[22px] border border-white/10 bg-white/9 px-4 py-4 text-sm leading-7 text-slate-700 backdrop-blur-xl dark:border-white/8 dark:bg-white/5 dark:text-slate-300"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="relative">
            <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(20,191,255,0.22),transparent_42%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/8 p-5 backdrop-blur-2xl dark:border-white/8 dark:bg-white/4 sm:p-6">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))] p-5 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(16,31,56,0.88),rgba(7,17,29,0.55))]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                      Painel de operacao
                    </p>
                    <h2 className="mt-3 text-[2.1rem] leading-none text-slate-950 dark:text-white">
                      Clareza para cada etapa comercial.
                    </h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl border border-white/12 bg-cyan-400/16" />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[22px] border border-white/10 bg-white/55 px-4 py-4 dark:border-white/8 dark:bg-white/6"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-cyan-100/55">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-4xl font-semibold leading-none text-slate-950 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Pedidos, reposicao e consignado
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Integrado
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Estoque, repasse e equipe
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Em sincronia
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/55 px-4 py-3 dark:border-white/8 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Margem, fluxo e performance
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Com contexto
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-cyan-400/12 bg-cyan-400/10 px-5 py-4 text-sm leading-7 text-slate-700 dark:text-cyan-50/88">
                  Produto pensado para empresas que cresceram alem da planilha e
                  precisam de um sistema com presenca, leitura operacional e valor
                  comercial.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-16 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.title}
                data-reveal
                className="rounded-[28px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/16 bg-cyan-400/10 text-cyan-700 dark:border-cyan-400/18 dark:bg-cyan-400/10 dark:text-cyan-200">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-[2rem] leading-none text-slate-950 dark:text-white">
                  {benefit.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {benefit.description}
                </p>
              </article>
            )
          })}
        </section>

        <section className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div data-reveal className="rounded-[30px] border border-white/10 bg-white/9 p-7 backdrop-blur-xl dark:border-white/8 dark:bg-white/4 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-cyan-100/55">
              Valor do produto
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.05em] text-slate-950 dark:text-white">
              Um sistema comercial com presenca de marca e leitura executiva.
            </h2>
          </div>

          <div data-reveal className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                Para quem
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Operacoes de atacado, consignado e equipes comerciais que precisam
                sair do improviso e ganhar clareza.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                Como entrega
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Interface premium, dados conectados e estrutura pronta para escalar
                com confianca.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/9 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/4 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                Resultado esperado
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Mais controle sobre pedidos, estoque, margem, equipe e rotina
                comercial, com uma experiencia digna de um software premium real.
              </p>
            </div>
          </div>
        </section>

        <section data-reveal className="pb-6">
          <div className="rounded-[34px] border border-white/10 bg-white/10 px-6 py-8 backdrop-blur-2xl dark:border-white/8 dark:bg-white/4 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-cyan-100/55">
                  Acesso ao sistema
                </p>
                <h2 className="mt-4 text-[clamp(2.3rem,4vw,4rem)] leading-[0.95] tracking-[-0.05em] text-slate-950 dark:text-white">
                  Entre no Viexon e comece uma operacao com mais clareza, presenca e controle.
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full px-6">
                  <Link href="/auth">Entrar</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/12 bg-white/36 px-6 dark:bg-white/5"
                >
                  <Link href="/auth">Criar conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
