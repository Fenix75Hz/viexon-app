"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { animate, remove } from "animejs"
import type { Session } from "@supabase/supabase-js"
import { AlertCircle, CheckCircle2, LoaderCircle, LogOut, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient, getSupabaseConfigError } from "@/lib/supabase/client"

type AuthMode = "login" | "signup"
type FeedbackTone = "error" | "success" | "info"

type FeedbackState = {
  tone: FeedbackTone
  text: string
} | null

const defaultValues = {
  email: "",
  password: "",
}

export function AuthPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<AuthMode>("login")
  const [values, setValues] = useState(defaultValues)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    remove(containerRef.current)
    animate(containerRef.current, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 900,
      easing: "easeOutExpo",
      delay: 180,
    })
  }, [])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      return
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setFeedback({
        tone: "error",
        text: getSupabaseConfigError(),
      })
      return
    }

    setLoading(true)
    setFeedback(null)

    const email = values.email.trim()
    const password = values.password.trim()

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        setFeedback({
          tone: "success",
          text: "Login realizado com sucesso. Sua sessao ja esta ativa no Viexon.",
        })
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
        },
      })

      if (error) {
        throw error
      }

      setFeedback({
        tone: "success",
        text: data.session
          ? "Conta criada com sucesso. Sua sessao ja esta ativa."
          : "Conta criada. Se a confirmacao por email estiver ativa, verifique sua caixa de entrada.",
      })
      setMode("login")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel concluir a autenticacao."

      setFeedback({
        tone: "error",
        text: message,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setFeedback({
        tone: "error",
        text: getSupabaseConfigError(),
      })
      return
    }

    setLoading(true)
    setFeedback(null)

    const { error } = await supabase.auth.signOut()

    if (error) {
      setFeedback({
        tone: "error",
        text: error.message,
      })
    } else {
      setFeedback({
        tone: "info",
        text: "Sessao encerrada com sucesso.",
      })
    }

    setLoading(false)
  }

  return (
    <div
      id="auth-panel"
      ref={containerRef}
      className="relative w-full max-w-[430px] opacity-0"
    >
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(29,188,255,0.18),transparent_42%)] blur-3xl dark:bg-[radial-gradient(circle_at_top,rgba(24,185,255,0.24),transparent_42%)]" />
      <div className="relative overflow-hidden rounded-[32px] border border-black/6 bg-white/78 p-4 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.42)] backdrop-blur-2xl transition-colors duration-500 dark:border-white/10 dark:bg-[#07111d]/72 dark:shadow-[0_32px_90px_-40px_rgba(0,172,255,0.45)]">
        <div className="rounded-[28px] border border-black/5 bg-white/72 p-7 transition-colors duration-500 dark:border-white/8 dark:bg-white/3">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/4 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-cyan-100/70">
                <ShieldCheck className="size-3.5" />
                Acesso seguro
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {session ? "Sessao ativa" : mode === "login" ? "Entrar no Viexon" : "Criar conta"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {session
                    ? "Sua autenticacao com Supabase ja esta pronta para os proximos modulos do sistema."
                    : "Acesse ou crie sua conta para seguir com a operacao premium do Viexon."}
                </p>
              </div>
            </div>
          </div>

          {session ? (
            <div className="space-y-5">
              <div className="rounded-[24px] border border-emerald-500/18 bg-emerald-500/8 p-4 text-sm text-emerald-900 dark:border-emerald-400/18 dark:bg-emerald-400/8 dark:text-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <div>
                    <p className="font-medium">Autenticacao confirmada</p>
                    <p className="mt-1 text-xs opacity-80">{session.user.email}</p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={handleSignOut}
              >
                {loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
                Encerrar sessao
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-black/6 bg-black/4 p-1 transition-colors duration-500 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    mode === "login"
                      ? "bg-slate-950 text-white shadow-[0_12px_30px_-18px_rgba(2,10,23,0.75)] dark:bg-white dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    mode === "signup"
                      ? "bg-slate-950 text-white shadow-[0_12px_30px_-18px_rgba(2,10,23,0.75)] dark:bg-white dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Criar conta
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, email: event.target.value }))
                    }
                    className="h-13 w-full rounded-2xl border border-black/10 bg-white/85 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-300/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300 dark:focus:ring-cyan-400/15"
                    placeholder="voce@empresa.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Senha
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={values.password}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, password: event.target.value }))
                    }
                    className="h-13 w-full rounded-2xl border border-black/10 bg-white/85 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-300/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300 dark:focus:ring-cyan-400/15"
                    placeholder="Minimo de 6 caracteres"
                  />
                </label>

                {feedback ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      feedback.tone === "error"
                        ? "border-rose-500/18 bg-rose-500/8 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100"
                        : feedback.tone === "success"
                          ? "border-emerald-500/18 bg-emerald-500/8 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100"
                          : "border-cyan-500/18 bg-cyan-500/8 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedback.tone === "error" ? (
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                      )}
                      <p>{feedback.text}</p>
                    </div>
                  </div>
                ) : null}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Processando
                    </>
                  ) : mode === "login" ? (
                    "Entrar com email"
                  ) : (
                    "Criar conta com email"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
