"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { siteNavigationItems } from "@/components/site/navigation";
import { SiteHeader } from "@/components/site/site-header";

type AudienceProfileKey = "revendedoras" | "clientes" | "operacao" | "gestao";

type AudienceProfile = {
  key: AudienceProfileKey;
  title: string;
  kicker: string;
  summary: string;
  outcomes: string[];
  signals: string[];
  modules: { title: string; description: string }[];
};

const audienceProfiles: AudienceProfile[] = [
  {
    key: "revendedoras",
    title: "Revendedoras",
    kicker: "Frente comercial",
    summary:
      "Para quem vive o dia a dia da venda e precisa de contexto, carteira organizada e previsibilidade — sem perder agilidade no relacionamento.",
    outcomes: [
      "Ritmo de venda mais consistente, com acompanhamento de carteira e pedidos em um só lugar.",
      "Mais qualidade no atendimento: histórico, preferências e continuidade de relacionamento.",
      "Menos ruído operacional: você sabe o que está em aberto, o que já foi combinado e o próximo passo.",
    ],
    signals: [
      "Você vende por relacionamento e quer consistência (não depender de mensagens soltas).",
      "Você precisa saber o status real de pedidos/consignado sem “caçar informação”.",
      "Você quer organizar carteira e rotina sem perder a sensação premium do atendimento.",
    ],
    modules: [
      {
        title: "Carteira com leitura clara",
        description: "Clientes, histórico e próximos passos para manter a cadência comercial sem improviso.",
      },
      {
        title: "Pedidos e consignado no fluxo",
        description: "Menos retrabalho para acompanhar status, separar, entregar e cobrar com consistência.",
      },
      {
        title: "Jornada do cliente conectada",
        description: "Uma relação mais contínua, com acesso orientado e contexto preservado.",
      },
    ],
  },
  {
    key: "clientes",
    title: "Clientes",
    kicker: "Experiência conectada",
    summary:
      "Para quem compra e quer clareza de vínculo, histórico e continuidade — com menos fricção, mais confiança e comunicação coerente.",
    outcomes: [
      "Uma experiência mais previsível: menos desencontro, mais continuidade e contexto.",
      "Vínculo claro com a revendedora, com acesso orientado ao que faz sentido para o cliente.",
      "Mais confiança: acompanhamento e histórico organizados, sem depender de mensagens dispersas.",
    ],
    signals: [
      "Você quer um relacionamento comercial mais consistente e confiável.",
      "Você valoriza clareza e histórico, sem “informação perdida”.",
      "Você precisa de uma experiência simples, com acesso ao seu contexto.",
    ],
    modules: [
      {
        title: "Acesso orientado",
        description: "O cliente vê o que precisa — sem ruído — com segurança e vínculo correto.",
      },
      {
        title: "Histórico e continuidade",
        description: "Contexto preservado para reduzir atrito e aumentar confiança ao longo do tempo.",
      },
      {
        title: "Relação mais saudável",
        description: "Menos dependência de canais soltos. Mais coerência e previsibilidade.",
      },
    ],
  },
  {
    key: "operacao",
    title: "Equipe comercial / operação",
    kicker: "Execução com controle",
    summary:
      "Para quem garante o funcionamento: pedidos, estoque, consignado e rotina — com menos planilhas, menos divergência e menos retrabalho.",
    outcomes: [
      "Fluxo operacional mais limpo: menos dependência de planilha e mensagens soltas.",
      "Mais rastreabilidade: o que está pendente, o que foi entregue e o que precisa de ação.",
      "Mais previsibilidade entre áreas: menos divergência e mais consistência no dia a dia.",
    ],
    signals: [
      "Sua operação sofre com retrabalho e informações quebradas.",
      "Você precisa de leitura confiável do que está em aberto e do que já foi resolvido.",
      "Você quer reduzir divergência sem travar a rotina.",
    ],
    modules: [
      {
        title: "Pedidos e estoque com rastreio",
        description: "Controle do fluxo com leitura única para reduzir ruídos e divergências.",
      },
      {
        title: "Consignado com consistência",
        description: "Visão clara do que está em uso, do que retorna e do que precisa ser ajustado.",
      },
      {
        title: "Operação conectada ao comercial",
        description: "Menos ruptura entre quem vende e quem executa. Mais previsibilidade para todos.",
      },
    ],
  },
  {
    key: "gestao",
    title: "Administração / gestão",
    kicker: "Leitura executiva",
    summary:
      "Para quem decide e precisa enxergar resultado, gargalos e ritmo comercial com dados conectados à operação real — sem achismo.",
    outcomes: [
      "Decisão com contexto: indicadores ligados ao que acontece na ponta.",
      "Mais governança: menos improviso e mais consistência de processo.",
      "Crescimento com controle: visão mais confiável para ajustar rota e priorizar ações.",
    ],
    signals: [
      "Você precisa medir ritmo comercial sem depender de relatórios manuais.",
      "Você quer clareza de gargalos para ajustar processo com precisão.",
      "Você precisa de governança e previsibilidade para crescer com menos improviso.",
    ],
    modules: [
      {
        title: "Indicadores conectados",
        description: "Leitura executiva com base na operação, não em recortes ou versões paralelas.",
      },
      {
        title: "Governança e processos",
        description: "Padronização e rastreabilidade para reduzir improviso e aumentar consistência.",
      },
      {
        title: "Ajuste fino do comercial",
        description: "Clareza para priorizar: carteira, conversão, gargalos e cadência.",
      },
    ],
  },
] as const;

const revealEase = [0.18, 1, 0.32, 1] as const;

function IconBadge({
  variant,
  title,
}: {
  variant: "revendedoras" | "clientes" | "operacao" | "gestao";
  title: string;
}) {
  const paths = useMemo(() => {
    switch (variant) {
      case "revendedoras":
        return (
          <>
            <path
              d="M7 16.6c1.1 1.1 2.6 1.7 4.3 1.7 3.3 0 5.7-2.4 5.7-5.7 0-1.7-.6-3.2-1.7-4.3"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M6.2 9.8c.8-2.6 3.1-4.5 6.2-4.5 1.2 0 2.2.2 3.1.7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path d="M8.6 11.6h7.2" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "clientes":
        return (
          <>
            <path
              d="M12 12.2a3.2 3.2 0 1 0-3.2-3.2 3.2 3.2 0 0 0 3.2 3.2Z"
              strokeWidth="1.6"
            />
            <path
              d="M6.6 19c1.2-2.6 3.1-4 5.4-4s4.2 1.4 5.4 4"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        );
      case "operacao":
        return (
          <>
            <path
              d="M7.2 14.3 6 12.2l1.2-2.1"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.8 14.3 18 12.2l-1.2-2.1"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.1 16.9h5.8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M9.1 7.5h5.8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M10.4 12.2h3.2"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        );
      case "gestao":
        return (
          <>
            <path
              d="M7.2 15.6v-3.2"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M12 15.6V8.8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M16.8 15.6v-5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M6.6 18.3h10.8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        );
    }
  }, [variant]);

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] shadow-[0_16px_46px_var(--shadow-soft)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-[var(--accent-primary)]"
        >
          {paths}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-tertiary)]">Perfil</p>
      </div>
    </div>
  );
}

function clampIndex(index: number, max: number) {
  if (index < 0) return 0;
  if (index > max) return max;
  return index;
}

export function AudiencePage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeKey, setActiveKey] = useState<AudienceProfileKey>("revendedoras");

  const activeProfile = useMemo(
    () => audienceProfiles.find((profile) => profile.key === activeKey) ?? audienceProfiles[0],
    [activeKey],
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(100,231,255,0.16),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(33,111,255,0.2),transparent_26%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px)",
          backgroundSize: "92px 92px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 92%)",
        }}
      />

      <SiteHeader
        currentLabel="Para quem"
        navigationItems={siteNavigationItems}
        loginHref="/login"
        primaryHref="/criar-conta"
        wrapperClassName="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8"
      />

      <section className="relative px-5 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px] pt-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: revealEase }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start"
          >
            <div className="max-w-[46rem]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl">
                Para quem
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                Posicionamento
              </div>

              <h1 className="font-display mt-8 text-balance text-[clamp(3.05rem,6.8vw,6.1rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
                Um produto premium para
                <span className="block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                  operações comerciais que precisam de clareza real.
                </span>
              </h1>

              <p className="mt-7 max-w-[42rem] text-pretty text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
                O Viexon foi criado para um ecossistema específico: quem vende, quem compra, quem faz
                a operação rodar e quem toma decisão. Nesta página, você entende rapidamente se o seu
                contexto está dentro do que o produto resolve — sem promessa genérica.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#perfis"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
                >
                  Escolher meu perfil
                </Link>
                <Link
                  href="/recursos"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_40px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
                >
                  Ver recursos
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-2.5">
                {[
                  "Clareza por perfil",
                  "Acesso com contexto",
                  "Operação rastreável",
                  "Decisão com leitura real",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(100,231,255,0.18),transparent_38%),radial-gradient(circle_at_88%_24%,rgba(33,111,255,0.14),transparent_42%)]"
              />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Mapa rápido
                </p>
                <p className="font-display mt-4 text-balance text-[1.9rem] leading-[1.06] tracking-[-0.055em] text-[var(--text-primary)] sm:text-[2.1rem]">
                  Se você se reconhece em um desses perfis, o Viexon foi pensado para o seu fluxo.
                </p>
                <div className="mt-7 grid gap-3">
                  {audienceProfiles.map((profile) => (
                    <button
                      key={profile.key}
                      type="button"
                      onClick={() => setActiveKey(profile.key)}
                      className={`group w-full rounded-[1.8rem] border bg-[var(--surface-elevated)] p-4 text-left shadow-[0_18px_60px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 ${
                        activeKey === profile.key
                          ? "border-[var(--border-strong)] bg-[var(--surface-strong)]"
                          : "border-[var(--border-soft)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <IconBadge variant={profile.key === "operacao" ? "operacao" : profile.key} title={profile.title} />
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{profile.summary}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="perfis" className="relative scroll-mt-32 px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="max-w-[52rem]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Quem deve usar
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.35rem,4.8vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
              Escolha um perfil e veja o valor com clareza — sem blocos genéricos.
            </h2>
            <p className="mt-6 max-w-[46rem] text-lg leading-8 text-[var(--text-secondary)]">
              O Viexon organiza experiência, acesso e leitura de acordo com o papel do usuário. Isso
              reduz ruído, preserva contexto e melhora a operação como um todo.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="grid gap-4">
              {audienceProfiles.map((profile, index) => {
                const isActive = profile.key === activeKey;
                return (
                  <button
                    key={profile.key}
                    type="button"
                    onClick={() => setActiveKey(profile.key)}
                    className={`group rounded-[2rem] border p-5 text-left shadow-[0_26px_80px_var(--shadow-soft)] backdrop-blur-2xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 ${
                      isActive
                        ? "border-[var(--border-strong)] bg-[var(--surface-strong)]"
                        : "border-[var(--border-soft)] bg-[var(--surface-panel)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                          {profile.kicker}
                        </p>
                        <h3 className="font-display mt-4 truncate text-[1.6rem] leading-none tracking-[-0.055em] text-[var(--text-primary)] sm:text-[1.85rem]">
                          {profile.title}
                        </h3>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] text-sm font-semibold text-[var(--accent-primary)]">
                        0{clampIndex(index + 1, 9)}
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{profile.summary}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {profile.modules.slice(0, 2).map((item) => (
                        <span
                          key={item.title}
                          className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3.5 py-2 text-sm text-[var(--text-secondary)]"
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--surface-panel),var(--surface-elevated))] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(100,231,255,0.14),transparent_40%),radial-gradient(circle_at_78%_26%,rgba(33,111,255,0.12),transparent_44%)]"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.key}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: revealEase }}
                  className="relative"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                        {activeProfile.kicker}
                      </p>
                      <h3 className="font-display mt-4 text-balance text-[2.15rem] leading-[1.02] tracking-[-0.06em] text-[var(--text-primary)] sm:text-[2.5rem]">
                        {activeProfile.title}
                      </h3>
                      <p className="mt-4 max-w-[46rem] text-base leading-7 text-[var(--text-secondary)]">
                        {activeProfile.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/#hero-cta"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_64px_var(--accent-glow)]"
                      >
                        Pedir demonstração
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                        O que você ganha
                      </p>
                      <ul className="mt-4 space-y-3">
                        {activeProfile.outcomes.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                        Você se encaixa se…
                      </p>
                      <ul className="mt-4 space-y-3">
                        {activeProfile.signals.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {activeProfile.modules.map((module) => (
                      <div
                        key={module.title}
                        className="rounded-[1.9rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 shadow-[0_18px_60px_var(--shadow-soft)]"
                      >
                        <p className="font-display text-[1.25rem] tracking-[-0.04em] text-[var(--text-primary)]">
                          {module.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                          {module.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="max-w-[36rem]">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
                Por que funciona
              </p>
              <h2 className="font-display mt-5 text-balance text-[clamp(2.2rem,4.2vw,4.1rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
                Quando a operação está em uma base única, o valor aparece em cada ponta.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
                O Viexon foi desenhado para reduzir fragmentação e aumentar clareza. Isso não é sobre
                “ter mais funcionalidades” — é sobre ter menos ruído e mais leitura real.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Contexto preservado",
                  description:
                    "Histórico, vínculo e fluxo ficam visíveis para o perfil certo — sem caça ao detalhe e sem informação perdida.",
                },
                {
                  title: "Rastreabilidade operacional",
                  description:
                    "O que está pendente, o que está em andamento e o que já foi resolvido com leitura única e menos divergência.",
                },
                {
                  title: "Experiência orientada por papel",
                  description:
                    "Cada perfil entra com um recorte coerente: menos complexidade na interface, mais foco no que importa.",
                },
                {
                  title: "Leitura executiva conectada",
                  description:
                    "Indicadores com ligação ao que acontece na ponta, para decidir com contexto e ajustar processo com precisão.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.66, delay: 0.05 * index, ease: revealEase }}
                  className="group relative overflow-hidden rounded-[2.1rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_26px_80px_var(--shadow-soft)] backdrop-blur-2xl transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,231,255,0.12),transparent_38%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <p className="font-display text-[1.55rem] tracking-[-0.05em] text-[var(--text-primary)]">
                      {item.title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-24 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: revealEase }}
          className="mx-auto flex w-full max-w-[1080px] flex-col items-center rounded-[2.4rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-6 py-10 text-center shadow-[0_36px_120px_var(--shadow-soft)] backdrop-blur-2xl sm:px-10"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
            Próximo passo
          </p>
          <h2 className="font-display mt-5 max-w-[15ch] text-balance text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
            Se o seu ecossistema precisa de clareza, o Viexon foi desenhado para esse tipo de operação.
          </h2>
          <p className="mt-5 max-w-[42rem] text-lg leading-8 text-[var(--text-secondary)]">
            Explore os recursos para entender as camadas do produto ou vá direto para a demonstração
            para mapear seu cenário com o time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/recursos"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_44px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Explorar recursos
            </Link>
            <Link
              href="/#hero-cta"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
            >
              Pedir demonstração
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
