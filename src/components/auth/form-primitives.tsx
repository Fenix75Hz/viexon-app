"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

const inputClassName =
  "w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:bg-[var(--surface-elevated)] focus:shadow-[0_0_0_4px_rgba(100,231,255,0.08)]";

export function Field({
  autoComplete,
  defaultValue,
  error,
  label,
  name,
  placeholder,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClassName}
      />
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-sm text-rose-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function PasswordField({
  autoComplete,
  error,
  label,
  name,
  placeholder,
}: {
  autoComplete?: string;
  error?: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)] transition-opacity duration-300 hover:opacity-80"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <input
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClassName}
      />

      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-sm text-rose-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function InlineMessage({
  message,
  tone,
}: {
  message: string;
  tone: "error" | "success";
}) {
  return (
    <div
      className={`rounded-[22px] border px-4 py-3 text-sm leading-6 ${
        tone === "error"
          ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      }`}
    >
      {message}
    </div>
  );
}

export function SubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] via-[#86efff] to-[var(--accent-secondary)] px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_22px_58px_var(--accent-glow)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_76px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
