"use client";

import Link from "next/link";
import { useActionState, useDeferredValue, useEffect, useMemo, useState } from "react";

import type { PublicResellerSearchResult, UserRole } from "@/types/database";

import { initialAuthActionState } from "@/lib/auth/action-state";
import {
  completeOnboardingAction,
  registerAction,
} from "@/lib/auth/actions";

import { Field, InlineMessage, PasswordField, SubmitButton } from "./form-primitives";

type RegisterFormProps = {
  initialAccountType?: UserRole;
  initialMessage?: string | null;
  mode: "complete" | "signup";
};

type SearchResponse = {
  error?: string;
  results?: PublicResellerSearchResult[];
};

const roleOptions: Array<{
  description: string;
  title: string;
  value: UserRole;
}> = [
  {
    description: "Gerencie pedidos, estoque, clientes e financeiro com um acesso principal.",
    title: "Criar conta como revendedora",
    value: "reseller",
  },
  {
    description: "Acesse seu catalogo e mantenha o vinculo correto com sua revendedora.",
    title: "Criar conta como cliente",
    value: "customer",
  },
];

export function RegisterForm({
  initialAccountType = "reseller",
  initialMessage,
  mode,
}: RegisterFormProps) {
  const action = mode === "signup" ? registerAction : completeOnboardingAction;
  const [state, formAction] = useActionState(action, initialAuthActionState);
  const [accountType, setAccountType] = useState<UserRole>(initialAccountType);
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

  const intro = useMemo(() => {
    if (mode === "complete") {
      return {
        description:
          "Sua conta ja existe. Finalize o perfil abaixo para liberar o acesso completo na plataforma.",
        eyebrow: "Finalizar cadastro",
        title: "Conclua o perfil com o vinculo certo.",
      };
    }

    return {
      description:
        "Escolha o tipo de acesso, preencha os dados essenciais e conclua o onboarding conectado ao Supabase ja configurado no projeto.",
      eyebrow: "Criar conta",
      title: "Entre no Viexon com um fluxo claro e profissional.",
    };
  }, [mode]);

  function handleAccountTypeChange(nextType: UserRole) {
    setAccountType(nextType);
    setSearchError(null);
    setResults([]);
    setSelectedReseller(null);
    setResellerQuery("");
  }

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

  const activeRole = roleOptions.find((option) => option.value === accountType) ?? roleOptions[0];
  const message = state.message ?? initialMessage ?? null;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="accountType" value={accountType} />
      <input type="hidden" name="resellerPublicId" value={selectedReseller?.public_id ?? ""} />

      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          {intro.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.35rem]">
          {intro.title}
        </h2>
        <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          {intro.description}
        </p>
      </div>

      {message ? (
        <InlineMessage message={message} tone={state.status === "success" ? "success" : "error"} />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {roleOptions.map((option) => {
          const isActive = option.value === accountType;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAccountTypeChange(option.value)}
              className={`rounded-[26px] border px-5 py-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ${
                isActive
                  ? "border-[var(--border-strong)] bg-[var(--surface-soft)] shadow-[0_18px_52px_var(--shadow-soft)]"
                  : "border-[var(--border-soft)] bg-[var(--surface-panel)] hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {option.value === "reseller" ? "Revendedora" : "Cliente"}
              </span>
              <strong className="font-display mt-3 block text-[1.2rem] leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)]">
                {option.title}
              </strong>
              <span className="mt-3 block text-sm leading-7 text-[var(--text-secondary)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {state.fieldErrors.accountType ? (
        <p className="text-sm text-rose-300">{state.fieldErrors.accountType}</p>
      ) : null}

      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
            Perfil selecionado
          </p>
          <p className="font-display mt-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {activeRole.value === "reseller" ? "Fluxo de revendedora" : "Fluxo de cliente"}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {activeRole.description}
          </p>
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

          {accountType === "reseller" ? (
            <Field
              name="storeName"
              label="Nome da loja ou nome comercial"
              placeholder="Nome da sua loja"
              autoComplete="organization"
              error={state.fieldErrors.storeName}
            />
          ) : (
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

                {!selectedReseller && !isSearching && deferredQuery.length >= 2 && results.length === 0 && !searchError ? (
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
          )}

          {mode === "signup" ? (
            <>
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
            </>
          ) : null}
        </div>
      </div>

      <SubmitButton
        idleLabel={mode === "signup" ? "Criar conta" : "Concluir cadastro"}
        pendingLabel={mode === "signup" ? "Criando conta..." : "Concluindo cadastro..."}
      />

      <p className="text-sm leading-7 text-[var(--text-secondary)]">
        {mode === "signup" ? "Ja possui acesso?" : "Prefere entrar agora?"}{" "}
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
