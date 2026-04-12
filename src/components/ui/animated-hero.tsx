"use client"

import { useEffect, useRef } from "react"
import { animate, remove, set } from "animejs"

const rotatingWords = ["pedidos", "estoque", "margem", "repasse", "controle"]

export function AnimatedHeroWord() {
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const activeWordRef = useRef(0)

  useEffect(() => {
    const words = wordRefs.current.filter(
      (word): word is HTMLSpanElement => word instanceof HTMLSpanElement,
    )

    if (!words.length) {
      return
    }

    set(words, {
      opacity: 0,
      translateY: "118%",
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
        translateY: ["0%", "-118%"],
        duration: 520,
        easing: "easeInQuad",
      })

      animate(words[nextIndex], {
        opacity: [0, 1],
        translateY: ["118%", "0%"],
        duration: 720,
        easing: "easeOutExpo",
      })

      activeWordRef.current = nextIndex
    }, 2200)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <span className="relative inline-flex h-[1.02em] min-w-[6.4ch] items-center overflow-hidden align-bottom text-cyan-500 dark:text-cyan-300">
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
  )
}
