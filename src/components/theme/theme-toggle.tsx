"use client"

import { useEffect, useRef } from "react"
import { animate, remove } from "animejs"
import { MoonStar, SunMedium } from "lucide-react"

import { useTheme } from "@/components/providers/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const knobRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!knobRef.current || !buttonRef.current) {
      return
    }

    remove(knobRef.current)
    remove(buttonRef.current)

    animate(knobRef.current, {
      translateX: theme === "dark" ? 0 : 26,
      duration: 520,
      easing: "easeOutExpo",
    })

    animate(buttonRef.current, {
      scale: [0.98, 1],
      duration: 380,
      easing: "easeOutQuad",
    })
  }, [theme])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar modo ${theme === "dark" ? "claro" : "escuro"}`}
      className="group relative inline-flex h-14 w-[88px] items-center rounded-full border border-white/10 bg-white/70 p-1.5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-white/5"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.08))] opacity-80 dark:bg-[linear-gradient(135deg,rgba(69,195,255,0.16),rgba(9,15,28,0.05))]" />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-slate-500 dark:text-cyan-100/85">
        <MoonStar className="size-4" />
        <SunMedium className="size-4" />
      </span>
      <span
        ref={knobRef}
        className="absolute left-1.5 top-1.5 z-20 h-11 w-11 rounded-full bg-[linear-gradient(145deg,rgba(8,22,38,0.98),rgba(16,88,145,0.9))] shadow-[0_14px_30px_-16px_rgba(0,193,255,0.95)] dark:bg-[linear-gradient(145deg,rgba(11,26,44,1),rgba(18,114,193,0.92))]"
      />
    </button>
  )
}
