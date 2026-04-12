"use client"

import { useEffect, useRef } from "react"
import { animate, remove, set, stagger } from "animejs"
import {
  ArrowRight,
  ChartNoAxesCombined,
  PackageCheck,
  Sparkles,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const rotatingWords = ["atacado", "consignado", "pedidos", "estoque", "financeiro"]

const featureCards = [
  {
    icon: PackageCheck,
    title: "Operacao centralizada",
    description: "Pedidos, estoque e repasse comercial na mesma visao.",
  },
  {
    icon: WalletCards,
    title: "Financeiro com contexto",
    description: "Margem, comissao e fluxo com leitura executiva.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Crescimento previsivel",
    description: "Dados claros para revendedoras, equipe e tomada de decisao.",
  },
]

export function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const activeWordRef = useRef(0)

  useEffect(() => {
    if (!heroRef.current) {
      return
    }

    const heroElement = heroRef.current
    const revealTargets = heroElement.querySelectorAll("[data-reveal]")
    const cardTargets = heroElement.querySelectorAll("[data-card]")
    const glowTargets = heroElement.querySelectorAll("[data-glow]")

    set(revealTargets, { opacity: 0, translateY: 28 })
    set(cardTargets, { opacity: 0, translateY: 24 })

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [28, 0],
      delay: stagger(110),
      duration: 1000,
      easing: "easeOutExpo",
    })

    animate(cardTargets, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(90, { start: 360 }),
      duration: 850,
      easing: "easeOutExpo",
    })

    animate(glowTargets, {
      opacity: [0.4, 0.84],
      scale: [0.96, 1.04],
      duration: 3400,
      direction: "alternate",
      easing: "easeInOutSine",
      loop: true,
      delay: stagger(220),
    })
  }, [])

  useEffect(() => {
    const words = wordRefs.current.filter(
      (word): word is HTMLSpanElement => word instanceof HTMLSpanElement,
    )

    if (!words.length) {
      return
    }

    set(words, {
      opacity: 0,
      translateY: "120%",
    })

    set(words[0], {
      opacity: 1,
      translateY: "0%",
    })

    const intervalId = window.setInterval(() => {
      const previousIndex = activeWordRef.current
      const nextIndex = (previousIndex + 1) % words.length

      remove([words[previousIndex], words[nextIndex]])

      animate(words[previousIndex], {
        opacity: [1, 0],
        translateY: ["0%", "-120%"],
        duration: 500,
        easing: "easeInQuad",
      })

      animate(words[nextIndex], {
        opacity: [0, 1],
        translateY: ["120%", "0%"],
        duration: 680,
        easing: "easeOutExpo",
      })

      activeWordRef.current = nextIndex
    }, 2200)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div ref={heroRef} className="relative flex flex-col justify-center">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/8 p-6 backdrop-blur-2xl transition-colors duration-500 dark:border-white/8 dark:bg-white/4 sm:p-8 lg:p-10 xl:p-12">
        <div
          data-glow
          className="pointer-events-none absolute -left-8 top-8 h-52 w-52 rounded-full bg-cyan-300/22 blur-[100px] dark:bg-cyan-400/18"
        />
        <div
          data-glow
          className="pointer-events-none absolute bottom-0 right-4 h-64 w-64 rounded-full bg-blue-300/14 blur-[120px] dark:bg-blue-500/14"
        />

        <div className="relative z-10">
          <div
            data-reveal
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-600 transition-colors duration-500 dark:text-cyan-100/72"
          >
            <Sparkles className="size-3.5" />
            Landing publica e auth inicial
          </div>

          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
            <div className="space-y-8">
              <div data-reveal className="space-y-5">
                <p className="max-w-xl text-sm font-medium uppercase tracking-[0.32em] text-slate-500 dark:text-cyan-100/60">
                  Plataforma operacional premium
                </p>

                <h1 className="max-w-[10ch] text-[clamp(3.5rem,8vw,7rem)] leading-[0.88] tracking-[-0.05em] text-slate-950 dark:text-white">
                  Gestao premium para
                  <span className="mt-2 block text-slate-700 dark:text-cyan-50/92">
                    atacado, consignado e
                  </span>
                  <span className="relative mt-2 inline-flex h-[1.02em] min-w-[6.5ch] items-center overflow-hidden align-bottom text-cyan-500 dark:text-cyan-300">
                    {rotatingWords.map((word, index) => (
                      <span
                        key={word}
                        ref={(element) => {
                          wordRefs.current[index] = element
                        }}
                        className="absolute left-0 top-0"
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </h1>

                <p className="max-w-[62ch] text-[15px] leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                  O Viexon organiza pedidos, estoque, revendedoras, clientes e
                  financeiro em uma experiencia unica, refinada e pronta para
                  operacoes comerciais que exigem clareza, velocidade e controle.
                </p>
              </div>

              <div data-reveal className="flex flex-col gap-3 sm:flex-row">
                <a href="#auth-panel">
                  <Button size="lg" className="group h-12 min-w-[190px] gap-2 rounded-full px-6">
                    Entrar no Viexon
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </a>
                <a href="#auth-panel">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 min-w-[170px] rounded-full border-white/12 bg-white/40 px-6 dark:bg-white/5"
                  >
                    Criar conta
                  </Button>
                </a>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {featureCards.map((card) => {
                  const Icon = card.icon

                  return (
                    <div
                      key={card.title}
                      data-card
                      className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl dark:border-white/8 dark:bg-white/5"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/16 bg-cyan-400/12 text-cyan-700 dark:border-cyan-400/18 dark:bg-cyan-400/10 dark:text-cyan-200">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-[1.55rem] leading-none text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-[24ch] text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {card.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div data-reveal className="space-y-4 xl:pb-2">
              <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl dark:border-white/8 dark:bg-white/5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                  Visibilidade
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
                  24h
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Acompanhe pedidos, repasses e indicadores sem perder contexto
                  operacional.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.1))] p-5 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(18,35,66,0.7),rgba(7,17,29,0.55))]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-cyan-100/55">
                  Estrutura
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Pedidos e consignado
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Integrado
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Estoque e repasse
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Em tempo real
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Financeiro e margem
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      Com contexto
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
