"use client";

import Link from "next/link";
import { useActionState, useDeferredValue, useEffect, useState } from "react";

import type { PublicResellerSearchResult, UserRole } from "@/types/database";

import { initialAuthActionState } from "@/lib/auth/action-state";
import { registerAction } from "@/lib/auth/actions";

import { Field, InlineMessage, PasswordField, SubmitButton } from "./form-primitives";

type RegisterFormProps = {
  initialAccountType?: UserRole;
  initialMessage?: string | null;
};

type SearchResponse = {
  error?: string;
  results?: PublicResellerSearchResult[];
};

export function RegisterForm({
  initialAccountType = "customer",
  initialMessage,
}: RegisterFormProps) {
  const [state, formAction] = useActionState(registerAction, initialAuthActionState);
  const [accountType] = useState<UserRole>(initialAccountType);
  const [resellerQuery, setResellerQuery] = useState("");
  const [selectedReseller, setSelectedReseller] = useState<PublicResellerSearchResult | null>(null);
  const [results, setResults] = useState<PublicResellerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(resellerQuery.trim());

  useEffect(() => {
    if (accountType !== "customer") {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    if (
      selectedReseller &&
      deferredQuery.length > 0 &&
      deferredQuery.toLowerCase() === selectedReseller.public_name.toLowerCase()
    ) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    if (deferredQuery.length < 2) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/resellers/search?q=${encodeURIComponent(deferredQuery)}`,
          {
            signal: controller.signal,
          },
        );
        const payload = (await response.json()) as SearchResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Nao foi possivel pesquisar revendedoras.");
        }

        setResults(payload.results ?? []);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setResults([]);
        setSearchError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel pesquisar revendedoras agora.",
        );
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [accountType, deferredQuery, selectedReseller]);

  function handleResellerInputChange(value: string) {
    setResellerQuery(value);

    if (
      selectedReseller &&
      value.trim().toLowerCase() !== selectedReseller.public_name.toLowerCase()
    ) {
      setSelectedReseller(null);
    }
  }

  function handleResellerSelect(result: PublicResellerSearchResult) {
    setSelectedReseller(result);
    setResellerQuery(result.public_name);
    setResults([]);
    setSearchError(null);
  }

  const message = state.message ?? initialMessage ?? null;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="accountType" value={accountType} />
      <input type="hidden" name="resellerPublicId" value={selectedReseller?.public_id ?? ""} />

      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          Criar conta
        </p>
        <h2 className="font-display mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.35rem]">
          Cliente entra pelo app. Revendedora entra por liberacao manual.
        </h2>
        <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          O cadastro publico agora atende apenas clientes. A revendedora sera criada por voce no
          Supabase e depois podera entrar direto com e-mail e senha.
        </p>
      </div>

      {message ? (
        <InlineMessage message={message} tone={state.status === "success" ? "success" : "error"} />
      ) : null}

      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
            Acesso disponivel no app
          </p>
          <p className="font-display mt-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Fluxo de cliente
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            Escolha sua revendedora, crie a senha e conclua o acesso no mesmo fluxo.
          </p>
        </div>

        <div className="mb-6 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          Revendedoras nao se cadastram mais por esta tela. Esse perfil agora e provisionado
          manualmente no Supabase.
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="fullName"
            label="Nome completo"
            placeholder="Seu nome completo"
            autoComplete="name"
            error={state.fieldErrors.fullName}
          />

          <Field
            name="phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            error={state.fieldErrors.phone}
          />

          <div className="sm:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                Buscar revendedora
              </span>
              <input
                value={resellerQuery}
                onChange={(event) => handleResellerInputChange(event.target.value)}
                placeholder="Pesquise pelo nome da revendedora"
                aria-invalid={Boolean(state.fieldErrors.resellerPublicId)}
                aria-describedby={
                  state.fieldErrors.resellerPublicId ? "resellerPublicId-error" : undefined
                }
                className="w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:bg-[var(--surface-elevated)] focus:shadow-[0_0_0_4px_rgba(100,231,255,0.08)]"
              />
            </label>

            <div className="mt-3 space-y-3">
              {selectedReseller ? (
                <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)]">
                  <span className="font-medium">{selectedReseller.public_name}</span>
                  <span className="text-[var(--text-tertiary)]">/{selectedReseller.slug}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReseller(null);
                      setResellerQuery("");
                    }}
                    className="ml-auto text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]"
                  >
                    Trocar
                  </button>
                </div>
              ) : null}

              {isSearching ? (
                <p className="text-sm text-[var(--text-secondary)]">Buscando revendedoras...</p>
              ) : null}

              {!selectedReseller && results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <button
                      key={result.public_id}
                      type="button"
                      onClick={() => handleResellerSelect(result)}
                      className="flex w-full items-center justify-between gap-3 rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
                    >
                      <span>
                        <span className="block text-sm font-medium text-[var(--text-primary)]">
                          {result.public_name}
                        </span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                          {result.slug}
                        </span>
                      </span>
                      <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        {result.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {!selectedReseller &&
              !isSearching &&
              deferredQuery.length >= 2 &&
              results.length === 0 &&
              !searchError ? (
                <p className="text-sm text-[var(--text-secondary)]">
                  Nenhuma revendedora encontrada com esse nome.
                </p>
              ) : null}

              {searchError ? <p className="text-sm text-rose-300">{searchError}</p> : null}
              {state.fieldErrors.resellerPublicId ? (
                <p id="resellerPublicId-error" className="text-sm text-rose-300">
                  {state.fieldErrors.resellerPublicId}
                </p>
              ) : null}
            </div>
          </div>

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
            placeholder="Crie uma senha segura"
            autoComplete="new-password"
            error={state.fieldErrors.password}
          />

          <div className="sm:col-span-2">
            <PasswordField
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="Repita sua senha"
              autoComplete="new-password"
              error={state.fieldErrors.confirmPassword}
            />
          </div>
        </div>
      </div>

      <SubmitButton idleLabel="Criar conta" pendingLabel="Criando conta..." />

      <p className="text-sm leading-7 text-[var(--text-secondary)]">
        Revendedora ja provisionada ou cliente com acesso?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--accent-primary)] transition-opacity duration-300 hover:opacity-80"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
