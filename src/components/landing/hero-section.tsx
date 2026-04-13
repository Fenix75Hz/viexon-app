"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { startTransition, useEffect, useEffectEvent, useState, useSyncExternalStore } from "react";

import { ViexonLogo } from "./viexon-logo";

type ThemeMode = "dark" | "light";

const navigationItems = [
  { href: "#solucao", label: "Solução" },
  { href: "#modulos", label: "Módulos" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#acesso", label: "Acesso" },
];

const rotatingPhrases = [
  "Muito mais sofisticada",
  "Muito mais inteligente",
  "Muito mais profissional",
  "Muito mais estratégica",
];

const capabilityModules = [
  { label: "Atacado", icon: "wholesale" },
  { label: "Consignado", icon: "consigned" },
  { label: "Pedidos", icon: "orders" },
  { label: "Estoque", icon: "inventory" },
  { label: "Clientes", icon: "clients" },
  { label: "Financeiro", icon: "finance" },
] as const;

const keyMetrics = [
  { label: "Pedidos confirmados", value: "284", delta: "+18%" },
  { label: "Clientes ativos", value: "1.240", delta: "+9%" },
  { label: "Acertos do dia", value: "R$ 48 mil", delta: "+12%" },
  { label: "Estoque sincronizado", value: "98,4%", delta: "estável" },
];

const heroPillars = [
  {
    title: "Operação centralizada",
    detail: "Pedidos, estoque, consignado e financeiro conectados no mesmo fluxo.",
  },
  {
    title: "Presença comercial",
    detail: "Uma experiência premium para organizar a gestão sem parecer um sistema genérico.",
  },
  {
    title: "Escala com clareza",
    detail: "Criado para revendedoras, equipe e administração atuarem com mais precisão.",
  },
];

const heroEase = [0.16, 1, 0.3, 1] as const;
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
      <motion.span
        initial={false}
        animate={{ x: theme === "light" ? 39 : 0 }}
        transition={{ duration: 0.42, ease: heroEase }}
        className="absolute left-1 top-1 h-9 w-[41px] rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] shadow-[0_12px_28px_var(--shadow-soft)]"
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

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center px-1 py-1 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
    >
      <span>{label}</span>
      <span className="pointer-events-none absolute inset-x-1 -bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--accent-primary)] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}

function PrimaryButton({ href, children }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-[var(--accent-primary)] via-[#83eeff] to-[var(--accent-secondary)] px-7 py-3.5 text-base font-semibold text-slate-950 shadow-[0_18px_50px_var(--accent-glow)] transition-[transform,box-shadow,filter] duration-500 hover:-translate-y-1 hover:shadow-[0_26px_80px_var(--accent-glow)]"
    >
      <span className="pointer-events-none absolute inset-y-0 left-[-28%] w-1/3 -skew-x-12 bg-white/45 opacity-0 blur-xl transition-all duration-700 group-hover:left-[110%] group-hover:opacity-70" />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_54%)] opacity-70" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function SecondaryButton({ href, children }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-7 py-3.5 text-base font-semibold text-[var(--text-primary)] shadow-[0_14px_44px_var(--shadow-soft)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:shadow-[0_20px_58px_var(--shadow-strong)]"
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function ModuleIcon({ type }: { type: (typeof capabilityModules)[number]["icon"] }) {
  const sharedProps = {
    className: "h-[18px] w-[18px] fill-none stroke-current",
    "aria-hidden": true,
    viewBox: "0 0 24 24",
  } as const;

  switch (type) {
    case "wholesale":
      return (
        <svg {...sharedProps}>
          <path
            d="M5 9.5 12 5l7 4.5v8L12 22l-7-4.5v-8Z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M5 9.5 12 14l7-4.5" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "consigned":
      return (
        <svg {...sharedProps}>
          <path
            d="M7 7h10l2 4-7 9-7-9 2-4Z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9.8 7 12 11l2.2-4" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "orders":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="4.5" width="14" height="15" rx="2.5" strokeWidth="1.6" />
          <path d="M9 9.5h6M9 13h6M9 16.5h3.5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "inventory":
      return (
        <svg {...sharedProps}>
          <path d="M4.5 8.5 12 4l7.5 4.5L12 13 4.5 8.5Z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4.5 15.5 12 20l7.5-4.5M12 13v7" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "clients":
      return (
        <svg {...sharedProps}>
          <path d="M8.5 11.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6ZM16 12.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" strokeWidth="1.6" />
          <path
            d="M4.5 18.5c.7-2.2 2.5-3.3 5-3.3s4.3 1.1 5 3.3M14.5 18.5c.35-1.35 1.45-2.1 3.05-2.1 1.15 0 1.95.28 2.55.9"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...sharedProps}>
          <path d="M5.5 7.5h13M6.5 7.5l1 10h9l1-10M9.5 10.5v4.5M14.5 10.5v4.5" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.5 7.5a2.5 2.5 0 0 1 5 0" strokeWidth="1.6" />
        </svg>
      );
  }
}

function FeatureBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: heroEase }}
      className="mx-auto mt-8 w-full max-w-[1040px]"
    >
      <div className="relative overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[var(--nav-surface)] p-2.5 shadow-[0_22px_70px_var(--shadow-soft)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div
          id="modulos"
          className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-6"
        >
          {capabilityModules.map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.28, ease: heroEase }}
              className={`group relative rounded-[20px] border border-transparent px-4 py-4 transition-[background-color,border-color,box-shadow] duration-300 hover:border-[var(--border-soft)] hover:bg-[var(--surface-panel)] ${
                index < capabilityModules.length - 1
                  ? "lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-8 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-[var(--border-soft)]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--accent-primary)] shadow-[0_10px_24px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-105">
                  <ModuleIcon type={item.icon} />
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RotatingPhrase() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const advancePhrase = useEffectEvent(() => {
    startTransition(() => {
      setActiveIndex((current) => (current + 1) % rotatingPhrases.length);
    });
  });

  useEffect(() => {
    const intervalId = window.setInterval(advancePhrase, shouldReduceMotion ? 4200 : 3200);
    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion]);

  return (
    <div className="relative mx-auto max-w-fit overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-5 py-2 shadow-[0_18px_52px_var(--shadow-soft)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500">
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-70" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-80" />
      <div className="relative min-h-8 min-w-[20ch] overflow-hidden sm:min-h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={rotatingPhrases[activeIndex]}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, filter: "blur(12px)", scale: 0.985 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -18, filter: "blur(12px)", scale: 1.01 }
            }
            transition={{ duration: 0.65, ease: heroEase }}
            className="font-display absolute inset-0 whitespace-nowrap text-[clamp(1.12rem,4vw,1.75rem)] font-semibold tracking-[-0.04em] text-[var(--accent-primary)]"
          >
            {rotatingPhrases[activeIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  const ambientTransition = shouldReduceMotion
    ? undefined
    : { duration: 26, ease: "easeInOut" as const, repeat: Number.POSITIVE_INFINITY };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1, 1.06, 0.98, 1], opacity: [0.52, 0.68, 0.46, 0.52] }
        }
        transition={ambientTransition}
        className="absolute left-1/2 top-[9rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--hero-spotlight) 0%, transparent 68%)",
        }}
      />
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [-14, 18, -10], y: [0, 24, -6], scale: [1, 1.04, 0.98] }
        }
        transition={ambientTransition}
        className="absolute left-[-10%] top-[2%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 72%)",
        }}
      />
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [10, -16, 10], y: [0, -12, 0], scale: [0.98, 1.05, 0.98] }
        }
        transition={{ ...ambientTransition, duration: 31 }}
        className="absolute right-[-12%] top-[4%] h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--hero-spotlight-secondary) 0%, transparent 72%)",
        }}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: [0.28, 0.38, 0.28] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px)",
          backgroundSize: "108px 108px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.82), transparent 88%)",
        }}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [-18, 18, -18] }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 h-[38rem] opacity-80"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 24%), radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 48%)",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.88), transparent 85%)",
        }}
      />
    </div>
  );
}

function HeroOverview() {
  return (
    <motion.div
      id="demonstracao"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.2, ease: heroEase }}
      className="relative mx-auto mt-14 w-full max-w-[1120px]"
    >
      <div className="relative overflow-hidden rounded-[34px] border border-[var(--border-strong)] bg-[var(--surface-panel)] p-4 shadow-[0_45px_140px_var(--shadow-strong)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500 sm:p-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at top right, var(--accent-glow) 0%, transparent 34%)",
          }}
        />
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 transition-[background-color,border-color,box-shadow] duration-500 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-5">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                Ecossistema comercial Viexon
              </p>
              <h3 className="font-display mt-2 text-[1.55rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[1.9rem]">
                Uma plataforma pensada para comandar a operação com clareza.
              </h3>
            </div>
            <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[var(--text-secondary)] transition-[background-color,border-color,color] duration-500">
              Estrutura premium para venda e gestão
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 transition-[background-color,border-color,box-shadow] duration-500">
              <p className="text-sm text-[var(--text-secondary)]">Visão institucional</p>
              <p className="font-display mt-3 text-[1.7rem] font-semibold leading-[1.04] tracking-[-0.05em] text-[var(--text-primary)]">
                Do primeiro pedido ao financeiro, tudo responde no mesmo lugar.
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                O Viexon foi pensado para profissionalizar a operação comercial de revendedoras,
                equipe e administração com mais controle, presença e organização.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {keyMetrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.28, ease: heroEase }}
                  className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-4 transition-[background-color,border-color,box-shadow] duration-500 hover:shadow-[0_18px_48px_var(--shadow-soft)]"
                >
                  <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <strong className="font-display text-[1.7rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                      {metric.value}
                    </strong>
                    <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent-primary)] transition-[background-color,color] duration-500">
                      {metric.delta}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div id="experiencia" className="mt-6 grid gap-3 md:grid-cols-3">
            {heroPillars.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.28, ease: heroEase }}
                className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 transition-[background-color,border-color,box-shadow] duration-500 hover:shadow-[0_18px_48px_var(--shadow-soft)]"
              >
                <p className="font-display text-[1.1rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const { mounted, theme, toggleTheme } = useThemeMode();

  return (
    <section
      id="solucao"
      className="relative isolate min-h-screen overflow-hidden text-[var(--text-primary)]"
    >
      <HeroBackground />

      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-3 shadow-[0_24px_80px_var(--shadow-soft)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow,transform] duration-500 sm:px-5">
          <Link aria-label="Viexon" href="/" className="shrink-0">
            <ViexonLogo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => (
              <NavLink key={item.label} href={item.href} label={item.label} />
            ))}
          </div>

          <div id="acesso" className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle mounted={mounted} theme={theme} onToggle={toggleTheme} />
            <Link
              href="#demonstracao"
              className="hidden rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[0_14px_38px_var(--shadow-soft)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:shadow-[0_18px_54px_var(--shadow-strong)] sm:inline-flex"
            >
              Entrar
            </Link>
            <Link
              href="#hero-cta"
              className="inline-flex rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_var(--accent-glow)] transition-[transform,box-shadow,filter] duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_var(--accent-glow)]"
            >
              Começar
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] items-center px-5 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: heroEase }}
            className="mx-auto max-w-[920px] text-center"
          >
            <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500">
              Plataforma premium para gestão comercial
            </div>

            <h1 className="font-display mt-8 text-balance text-[clamp(3.2rem,8vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[var(--text-primary)]">
              <span className="block">Viexon, agora,</span>
              <span className="block text-[var(--text-primary)]">sua operação inteira</span>
              <span className="block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                em um só lugar.
              </span>
            </h1>

            <div className="mt-7 flex justify-center">
              <RotatingPhrase />
            </div>

            <p className="mx-auto mt-6 max-w-[42rem] text-pretty text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              Centralize pedidos, estoque, clientes, consignado e financeiro em uma plataforma
              criada para quem quer vender com mais controle, presença e organização.
            </p>

            <div
              id="hero-cta"
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <PrimaryButton href="#modulos">Começar agora</PrimaryButton>
              <SecondaryButton href="#demonstracao">Ver demonstração</SecondaryButton>
            </div>
          </motion.div>

          <FeatureBar />
          <HeroOverview />
        </div>
      </div>
    </section>
  );
}
