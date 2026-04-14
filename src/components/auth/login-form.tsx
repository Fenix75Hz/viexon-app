"use client";

import Link from "next/link";
import { useActionState } from "react";

import { initialAuthActionState } from "@/lib/auth/action-state";
import { loginAction } from "@/lib/auth/actions";

import { Field, InlineMessage, PasswordField, SubmitButton } from "./form-primitives";

export function LoginForm({ initialMessage }: { initialMessage?: string | null }) {
  const [state, formAction] = useActionState(loginAction, initialAuthActionState);
  const message = state.message ?? initialMessage ?? null;

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          Login
        </p>
        <h2 className="font-display mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.4rem]">
          Entre e continue sua operacao com contexto.
        </h2>
        <p className="mt-3 max-w-[32rem] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          Use seu acesso principal. O sistema identifica automaticamente seu perfil e encaminha
          voce para a area correta.
        </p>
      </div>

      {message ? (
        <InlineMessage message={message} tone={state.status === "success" ? "success" : "error"} />
      ) : null}

      <Field
        name="email"
        type="email"
        label="E-mail"
        placeholder="voce@exemplo.com"
        autoComplete="email"
        error={state.fieldErrors.email}
      />

      <PasswordField
        name="password"
        label="Senha"
        placeholder="Sua senha"
        autoComplete="current-password"
        error={state.fieldErrors.password}
      />

      <SubmitButton idleLabel="Entrar" pendingLabel="Entrando..." />

      <p className="text-sm leading-7 text-[var(--text-secondary)]">
        Ainda nao tem conta?{" "}
        <Link
          href="/criar-conta"
          className="font-semibold text-[var(--accent-primary)] transition-opacity duration-300 hover:opacity-80"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}
