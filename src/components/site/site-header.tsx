"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { ViexonLogo } from "@/components/landing/viexon-logo";

type ThemeMode = "dark" | "light";

export type SiteNavigationItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  currentLabel?: string;
  loginHref: string;
  navigationItems: SiteNavigationItem[];
  primaryHref: string;
  wrapperClassName?: string;
};

const themeStorageKey = "viexon-theme";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
}

function useThemeMode() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document !== "undefined") {
      const currentTheme = document.documentElement.dataset.theme;

      if (currentTheme === "dark" || currentTheme === "light") {
        return currentTheme;
      }
    }

    return "dark";
  });

  return {
    mounted,
    theme,
    toggleTheme() {
      const nextTheme = theme === "dark" ? "light" : "dark";

      setTheme(nextTheme);
      applyTheme(nextTheme);
    },
  };
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-none stroke-current"
    >
      <path
        d="M19 15.5A7.5 7.5 0 0 1 8.5 5a7.7 7.7 0 1 0 10.5 10.5Z"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-none stroke-current"
    >
      <circle cx="12" cy="12" r="3.6" strokeWidth="1.7" />
      <path
        d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-none stroke-current"
    >
      {open ? (
        <path
          d="M7 7l10 10M17 7 7 17"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path d="M4.5 7.5h15" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4.5 12h15" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4.5 16.5h15" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function ThemeToggle({
  mounted,
  theme,
  onToggle,
}: {
  mounted: boolean;
  onToggle: () => void;
  theme: ThemeMode;
}) {
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="h-11 w-[90px] rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] shadow-[0_16px_42px_var(--shadow-soft)]"
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Ativar ${theme === "dark" ? "light mode" : "dark mode"}`}
      aria-pressed={theme === "light"}
      onClick={onToggle}
      className="group relative flex h-11 w-[90px] items-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] p-1 text-[var(--text-secondary)] shadow-[0_16px_42px_var(--shadow-soft)] backdrop-blur-2xl transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[0_22px_56px_var(--shadow-strong)]"
    >
      <span
        className={`absolute left-1 top-1 h-9 w-[41px] rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] shadow-[0_12px_28px_var(--shadow-soft)] transition-transform duration-500 ${
          theme === "light" ? "translate-x-[39px]" : "translate-x-0"
        }`}
      />
      <span
        className={`relative z-10 flex flex-1 items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
        }`}
      >
        <MoonIcon />
      </span>
      <span
        className={`relative z-10 flex flex-1 items-center justify-center transition-colors duration-300 ${
          theme === "light" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
        }`}
      >
        <SunIcon />
      </span>
    </button>
  );
}

function NavLink({
  href,
  isCurrent,
  label,
}: {
  href: string;
  isCurrent: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center px-1 py-1 text-sm font-medium transition-colors duration-300 ${
        isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
      aria-current={isCurrent ? "page" : undefined}
    >
      <span>{label}</span>
      <span
        className={`pointer-events-none absolute inset-x-1 -bottom-1 h-px origin-left bg-gradient-to-r from-[var(--accent-primary)] to-transparent transition-transform duration-500 ${
          isCurrent ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

export function SiteHeader({
  currentLabel,
  loginHref,
  navigationItems,
  primaryHref,
  wrapperClassName = "absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8",
}: SiteHeaderProps) {
  const { mounted, theme, toggleTheme } = useThemeMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={wrapperClassName}>
      <nav className="mx-auto w-full max-w-[1400px] rounded-[30px] border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-3 shadow-[0_24px_80px_var(--shadow-soft)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow,transform] duration-500 sm:rounded-full sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link aria-label="Viexon" href="/" className="shrink-0">
            <ViexonLogo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                isCurrent={item.label === currentLabel}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] text-[var(--text-primary)] shadow-[0_14px_38px_var(--shadow-soft)] transition-[background-color,border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:shadow-[0_18px_54px_var(--shadow-strong)] lg:hidden"
            >
              <MenuIcon open={isMobileMenuOpen} />
            </button>
            <ThemeToggle mounted={mounted} theme={theme} onToggle={toggleTheme} />
            <Link
              href={loginHref}
              className="hidden rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[0_14px_38px_var(--shadow-soft)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:shadow-[0_18px_54px_var(--shadow-strong)] sm:inline-flex"
            >
              Entrar
            </Link>
            <Link
              href={primaryHref}
              className="hidden rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_var(--accent-glow)] transition-[transform,box-shadow,filter] duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_var(--accent-glow)] sm:inline-flex"
            >
              Começar
            </Link>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 lg:hidden ${
            isMobileMenuOpen ? "mt-4 max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3 shadow-[0_18px_50px_var(--shadow-soft)]">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={item.label === currentLabel ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    item.label === currentLabel
                      ? "bg-[var(--surface-strong)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-[var(--border-soft)] pt-3 sm:hidden">
              <Link
                href={loginHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-[background-color,border-color] duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
