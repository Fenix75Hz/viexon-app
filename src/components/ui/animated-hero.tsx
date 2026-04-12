"use client"

import { useEffect, useRef } from "react"
import { animate, remove, set, stagger } from "animejs"
import { ArrowRight, ChartNoAxesCombined, PackageCheck, Sparkles, WalletCards } from "lucide-react"

import { Button } from "@/components/ui/button"

const rotatingWords = [
  "atacado",
  "consignado",
  "pedidos",
  "estoque",
  "financeiro",
]

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

    set(revealTargets, {
      opacity: 0,
      translateY: 34,
    })

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [34, 0],
      delay: stagger(120),
      duration: 1100,
      easing: "easeOutExpo",
    })

    animate(cardTargets, {
      translateY: [24, 0],
      opacity: [0, 1],
      delay: stagger(90, { start: 380 }),
      duration: 900,
      easing: "easeOutExpo",
    })

    const glowTargets = heroElement.querySelectorAll("[data-glow]")
    animate(glowTargets, {
      opacity: [0.45, 0.9],
      scale: [0.96, 1.05],
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
        duration: 520,
        easing: "easeInQuad",
      })

      animate(words[nextIndex], {
        opacity: [0, 1],
        translateY: ["120%", "0%"],
        duration: 720,
        easing: "easeOutExpo",
      })

      activeWordRef.current = nextIndex
    }, 2200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <div ref={heroRef} className="relative flex flex-col justify-center">
      <div className="relative overflow-hidden rounded-[38px] border border-black/6 bg-white/64 p-6 shadow-[0_40px_120px_-60px_rgba(18,25,38,0.45)] backdrop-blur-2xl transition-colors duration-500 dark:border-white/8 dark:bg-white/4 dark:shadow-[0_40px_120px_-70px_rgba(0,172,255,0.38)] sm:p-8 lg:p-10">
        <div
          data-glow
          className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-cyan-300/28 blur-3xl dark:bg-cyan-400/20"
        />
        <div
          data-glow
          className="pointer-events-none absolute -bottom-10 right-6 h-52 w-52 rounded-full bg-blue-300/18 blur-3xl dark:bg-blue-500/20"
        />

        <div className="relative z-10">
          <div
            data-reveal
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 transition-colors duration-500 dark:border-white/10 dark:bg-white/6 dark:text-cyan-100/72"
          >
            <Sparkles className="size-3.5" />
            Landing publica e auth inicial
          </div>

          <div className="space-y-6">
            <div data-reveal className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.06em] text-slate-950 dark:text-white md:text-6xl xl:text-[84px]">
                Gestao premium para
                <span className="mt-3 block text-slate-700 dark:text-cyan-50/92">
                  atacado, consignado e
                </span>
                <span className="relative mt-3 inline-flex h-[1.1em] min-w-[6.4ch] items-center overflow-hidden align-bottom text-cyan-500 dark:text-cyan-300">
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

              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                O Viexon organiza pedidos, estoque, revendedoras, clientes e
                financeiro em uma experiencia unica, refinada e pronta para
                operacoes comerciais que exigem clareza, velocidade e controle.
              </p>
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row">
              <a href="#auth-panel">
                <Button size="lg" className="group w-full gap-2 sm:w-auto">
                  Entrar no Viexon
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </a>
              <a href="#auth-panel">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Criar conta
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featureCards.map((card) => {
              const Icon = card.icon

              return (
                <div
                  key={card.title}
                  data-card
                  className="rounded-[26px] border border-black/6 bg-white/72 p-5 opacity-0 transition-colors duration-500 dark:border-white/8 dark:bg-white/5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/16 bg-cyan-400/12 text-cyan-700 dark:border-cyan-400/18 dark:bg-cyan-400/10 dark:text-cyan-200">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
