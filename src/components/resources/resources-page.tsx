"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { siteNavigationItems } from "@/components/site/navigation";
import { SiteHeader } from "@/components/site/site-header";

const featuredResources = [
  {
    title: "Pedidos",
    kicker: "Pedido ao fechamento",
    description:
      "Organize pedidos com mais precisão, reduza retrabalho comercial e mantenha o atendimento fluindo com contexto completo.",
    highlights: ["Histórico centralizado", "Acompanhamento de status", "Ritmo de operação previsível"],
  },
  {
    title: "Estoque",
    kicker: "Disponibilidade real",
    description:
      "Visualize giro, reposição e disponibilidade sem depender de controles paralelos ou conferências espalhadas.",
    highlights: ["Visão por etapa", "Menos ruptura", "Controle mais confiável"],
  },
  {
    title: "Clientes",
    kicker: "Relacionamento comercial",
    description:
      "Concentre cadastro, contexto e recorrência para sustentar atendimento premium e decisões comerciais melhores.",
    highlights: ["Base organizada", "Leitura rápida do relacionamento", "Mais continuidade na venda"],
  },
  {
    title: "Consignado",
    kicker: "Fluxo sensível sob controle",
    description:
      "Acompanhe saídas, retornos e acertos com visibilidade operacional real para evitar ruído e perda de margem.",
    highlights: ["Movimentação clara", "Menos divergência", "Acerto mais seguro"],
  },
  {
    title: "Financeiro",
    kicker: "Saúde da operação",
    description:
      "Conecte entradas, acertos e compromissos para enxergar o que está performando e o que exige ajuste.",
    highlights: ["Leitura de caixa", "Conciliação mais simples", "Decisão baseada em fluxo"],
  },
  {
    title: "Relatórios",
    kicker: "Leitura executiva",
    description:
      "Transforme rotina comercial em leitura prática para priorizar equipe, estoque, carteira e resultado.",
    highlights: ["Indicadores acionáveis", "Visão consolidada", "Mais clareza para crescer"],
  },
] as const;

const operationalMoments = [
  {
    title: "Operação comercial sincronizada",
    description:
      "Pedidos, atendimento, carteira e rotina comercial deixam de disputar informação em canais separados.",
  },
  {
    title: "Controle de ponta a ponta",
    description:
      "Da saída do item ao acerto financeiro, o sistema mantém a trilha da operação com leitura coerente.",
  },
  {
    title: "Decisão com contexto",
    description:
      "A gestão enxerga ritmo, gargalos e resultado com base em dados conectados, não em planilhas dispersas.",
  },
] as const;

const resourceColumns = [
  {
    title: "Núcleo comercial",
    items: ["Pedidos", "Clientes", "Operação comercial"],
  },
  {
    title: "Núcleo de controle",
    items: ["Estoque", "Consignado", "Financeiro"],
  },
  {
    title: "Núcleo de leitura",
    items: ["Relatórios", "Indicadores", "Acompanhamento executivo"],
  },
] as const;

const revealEase = [0.18, 1, 0.32, 1] as const;

function ResourceConstellation() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const layerShift = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -80]);

  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-[36rem]">
      <motion.div
        style={{ y: layerShift }}
        className="absolute inset-0 rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,rgba(100,231,255,0.16),rgba(33,111,255,0.08),transparent_70%)] shadow-[0_40px_120px_var(--shadow-strong)] backdrop-blur-2xl"
      />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, rotateX: 10, rotateY: -10 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
        transition={{ duration: 0.9, ease: revealEase }}
        className="absolute left-[8%] top-[12%] w-[64%] rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 shadow-[0_28px_80px_var(--shadow-strong)] backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Operação comercial
          </span>
          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-primary)]">
            ao vivo
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {["Pedidos confirmados", "Separação em andamento", "Clientes priorizados"].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-3"
            >
              <span className="text-sm text-[var(--text-secondary)]">{item}</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{["284", "61", "19"][index]}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, x: 18, y: 24, rotate: 4 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.95, delay: 0.08, ease: revealEase }}
        className="absolute right-[2%] top-[30%] w-[54%] rounded-[1.7rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 shadow-[0_28px_90px_var(--shadow-strong)] backdrop-blur-2xl"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          Financeiro e acerto
        </span>
        <div className="mt-6 h-28 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,rgba(100,231,255,0.22),transparent_68%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
              Caixa do dia
            </p>
            <p className="mt-2 font-display text-xl text-[var(--text-primary)]">R$ 48 mil</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
              Acertos
            </p>
            <p className="mt-2 font-display text-xl text-[var(--text-primary)]">98,4%</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 26, x: -12 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.9, delay: 0.16, ease: revealEase }}
        className="absolute bottom-[8%] left-[16%] w-[48%] rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-4 shadow-[0_24px_70px_var(--shadow-soft)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Leitura executiva</span>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_18px_var(--accent-glow)]" />
        </div>
        <div className="mt-4 flex items-end gap-2">
          {[42, 58, 49, 70, 64, 82].map((height, index) => (
            <motion.span
              key={`${height}-${index}`}
              animate={shouldReduceMotion ? undefined : { height: [`${height - 12}px`, `${height}px`, `${height - 6}px`] }}
              transition={{
                duration: 4.2,
                delay: index * 0.16,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
              }}
              className="block w-full rounded-full bg-gradient-to-t from-[var(--accent-secondary)] to-[var(--accent-primary)]"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function ResourcesPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(100,231,255,0.16),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(33,111,255,0.18),transparent_26%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(circle at center, black 42%, transparent 92%)",
        }}
      />

      <SiteHeader
        currentLabel="Recursos"
        navigationItems={siteNavigationItems}
        loginHref="/#demonstracao"
        primaryHref="/#hero-cta"
        wrapperClassName="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8"
      />

      <section className="relative px-5 pb-14 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1380px] gap-14 pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: revealEase }}
            className="max-w-[39rem]"
          >
            <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl">
              Recursos Viexon
            </div>
            <h1 className="font-display mt-8 text-balance text-[clamp(3.2rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              Gestão comercial com
              <span className="block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                profundidade operacional real.
              </span>
            </h1>
            <p className="mt-7 max-w-[34rem] text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              O Viexon organiza pedidos, estoque, clientes, consignado, financeiro e leitura
              executiva em uma experiência única, feita para operações que não podem depender de
              improviso.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#hero-cta"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
              >
                Começar com o Viexon
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_40px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
              >
                Voltar para a plataforma
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Pedidos", "Consignado", "Financeiro"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.72, delay: 0.14 + index * 0.08, ease: revealEase }}
                  className="rounded-[1.3rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-4 backdrop-blur-xl"
                >
                  <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                    Núcleo
                  </p>
                  <p className="mt-2 font-display text-xl tracking-[-0.04em]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <ResourceConstellation />
        </div>
      </section>

      <section className="relative px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-6 py-5 shadow-[0_28px_90px_var(--shadow-soft)] backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Recursos que sustentam a rotina comercial
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {["Pedidos", "Estoque", "Clientes", "Consignado", "Financeiro", "Relatórios"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="max-w-[40rem]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Principais recursos
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.4rem,4.8vw,4.6rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
              Recursos pensados para gestão comercial premium.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {featuredResources.map((resource, index) => (
              <motion.article
                key={resource.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6, rotateX: 1.5, rotateY: index % 2 === 0 ? -1.5 : 1.5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.05, ease: revealEase }}
                className="group relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_26px_80px_var(--shadow-soft)] backdrop-blur-2xl sm:p-7"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,231,255,0.12),transparent_34%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                    {resource.kicker}
                  </p>
                  <div className="mt-5 flex items-start justify-between gap-5">
                    <h3 className="font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--text-primary)]">
                      {resource.title}
                    </h3>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] text-sm font-semibold text-[var(--accent-primary)]">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-5 max-w-[32rem] text-base leading-7 text-[var(--text-secondary)]">
                    {resource.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {resource.highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3.5 py-2 text-sm text-[var(--text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1380px] gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
          <div className="max-w-[34rem]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Como os recursos se conectam
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.2rem,4.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              O valor não está só em cada módulo, mas na conexão entre eles.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
              O Viexon foi pensado para reduzir fricção entre venda, controle e gestão. Cada
              recurso sustenta uma etapa, mas a força da plataforma aparece quando a operação deixa
              de depender de sistemas soltos.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-8">
            <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--accent-primary)] to-transparent opacity-40 sm:left-10" />
            <div className="space-y-8">
              {operationalMoments.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
                  whileHover={shouldReduceMotion ? undefined : { x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: revealEase }}
                  className="relative pl-10 sm:pl-14"
                >
                  <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] text-[0.7rem] font-semibold text-[var(--accent-primary)] sm:left-[-2px]">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-[1.45rem] tracking-[-0.04em] text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[38rem] text-base leading-7 text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px] rounded-[2.4rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--surface-panel),var(--surface-elevated))] p-7 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
                Arquitetura funcional
              </p>
              <h2 className="font-display mt-5 text-balance text-[clamp(2.1rem,4vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                Um sistema desenhado para operar, controlar e decidir melhor.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {resourceColumns.map((column) => (
                <motion.div
                  key={column.title}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.35, ease: revealEase }}
                  className="rounded-[1.7rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5"
                >
                  <h3 className="font-display text-[1.2rem] tracking-[-0.04em] text-[var(--text-primary)]">
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {column.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
            Recursos com intenção
          </p>
          <h2 className="font-display mt-5 max-w-[14ch] text-balance text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
            Menos ruído operacional. Mais leitura, controle e escala.
          </h2>
          <p className="mt-5 max-w-[42rem] text-lg leading-8 text-[var(--text-secondary)]">
            A página de recursos mostra o que o Viexon organiza. A próxima etapa é transformar isso
            em fluxo real para login, cadastro e operação diária.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_44px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Ver landing principal
            </Link>
            <Link
              href="/#hero-cta"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
            >
              Ir para o início
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
