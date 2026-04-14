"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { siteNavigationItems } from "@/components/site/navigation";
import { SiteHeader } from "@/components/site/site-header";

const audienceProfiles = [
  {
    title: "Revendedoras",
    kicker: "Frente comercial",
    description:
      "Para quem precisa vender com contexto, acompanhar carteira e manter a operação organizada sem perder agilidade no relacionamento.",
    value: "Mais clareza para vender, acompanhar pedidos e sustentar uma rotina comercial premium.",
    points: ["Pedidos centralizados", "Histórico de clientes", "Mais previsibilidade de operação"],
  },
  {
    title: "Clientes",
    kicker: "Experiência conectada",
    description:
      "Para clientes que precisam de uma jornada mais organizada, com vínculo claro à revendedora e menos ruído no acompanhamento da relação comercial.",
    value: "Um ecossistema mais confiável, com acesso direcionado e experiência mais coerente.",
    points: ["Vínculo seguro com a revendedora", "Acesso ao próprio contexto", "Mais continuidade na relação"],
  },
  {
    title: "Operação comercial",
    kicker: "Rotina do dia a dia",
    description:
      "Para quem coordena pedidos, estoque, consignado e fluxo operacional e precisa reduzir dependência de planilhas, mensagens soltas e retrabalho.",
    value: "Menos ruptura entre áreas e mais controle da rotina em um único fluxo.",
    points: ["Fluxo operacional conectado", "Menos divergência", "Mais controle de ponta a ponta"],
  },
  {
    title: "Gestão e administração",
    kicker: "Leitura executiva",
    description:
      "Para lideranças que precisam enxergar resultado, gargalos e ritmo comercial com base em dados conectados à operação real.",
    value: "Uma visão mais confiável para decidir melhor, ajustar processos e crescer com menos improviso.",
    points: ["Indicadores mais claros", "Leitura financeira integrada", "Decisão com contexto"],
  },
] as const;

const ecosystemFlow = [
  {
    title: "Cada perfil entra com o contexto certo",
    description:
      "A plataforma identifica o papel do usuário e organiza a experiência de forma coerente com o que ele precisa acessar.",
  },
  {
    title: "A operação conecta os pontos",
    description:
      "Revendedora, cliente, rotina comercial e gestão deixam de atuar com informações quebradas entre ferramentas isoladas.",
  },
  {
    title: "O valor cresce com a integração",
    description:
      "Quanto mais a operação roda no mesmo sistema, maior a clareza para vender, controlar e decidir.",
  },
] as const;

const fitMatrix = [
  {
    label: "Revendedoras",
    emphasis: "Venda com presença",
    detail: "Contexto comercial, pedidos e relacionamento organizados na mesma base.",
  },
  {
    label: "Clientes",
    emphasis: "Relacionamento mais claro",
    detail: "Acesso vinculado com segurança e experiência conectada à revendedora.",
  },
  {
    label: "Operação",
    emphasis: "Fluxo sob controle",
    detail: "Pedidos, estoque, consignado e rotina em leitura única.",
  },
  {
    label: "Gestão",
    emphasis: "Decisão com leitura real",
    detail: "Indicadores, financeiro e acompanhamento sem fragmentação.",
  },
] as const;

const revealEase = [0.18, 1, 0.32, 1] as const;

function AudienceOrbit() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const slowShift = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -60]);
  const fastShift = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -100]);

  return (
    <div className="relative mx-auto h-[31rem] w-full max-w-[37rem]">
      <motion.div
        style={{ y: slowShift }}
        className="absolute inset-[8%] rounded-full border border-[var(--border-soft)] bg-[radial-gradient(circle,rgba(100,231,255,0.14),transparent_68%)] blur-3xl"
      />
      <motion.div
        style={{ y: fastShift }}
        className="absolute inset-0 rounded-[2.2rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,rgba(100,231,255,0.14),rgba(33,111,255,0.08),transparent_72%)] shadow-[0_44px_120px_var(--shadow-strong)] backdrop-blur-2xl"
      />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.88, ease: revealEase }}
        className="absolute left-1/2 top-1/2 flex h-[13.5rem] w-[13.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2.1rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] text-center shadow-[0_32px_100px_var(--shadow-strong)] backdrop-blur-2xl"
      >
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
          Ecossistema
        </span>
        <p className="font-display mt-4 text-[2.2rem] tracking-[-0.06em] text-[var(--text-primary)]">
          Viexon
        </p>
        <p className="mt-3 max-w-[11rem] text-sm leading-6 text-[var(--text-secondary)]">
          Uma base única para quem vende, opera, acompanha e decide.
        </p>
      </motion.div>

      {[
        { title: "Revendedoras", position: "left-[3%] top-[16%]", delay: 0.08 },
        { title: "Clientes", position: "right-[4%] top-[14%]", delay: 0.14 },
        { title: "Operação", position: "left-[8%] bottom-[12%]", delay: 0.2 },
        { title: "Gestão", position: "right-[8%] bottom-[10%]", delay: 0.26 },
      ].map((item) => (
        <motion.div
          key={item.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.74, delay: item.delay, ease: revealEase }}
          className={`absolute ${item.position} rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-5 py-4 shadow-[0_24px_70px_var(--shadow-soft)] backdrop-blur-xl`}
        >
          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            Perfil
          </span>
          <p className="font-display mt-2 text-[1.2rem] tracking-[-0.04em] text-[var(--text-primary)]">
            {item.title}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function AudiencePage() {
  const shouldReduceMotion = useReducedMotion();

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
        loginHref="/#demonstracao"
        primaryHref="/#hero-cta"
        wrapperClassName="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8"
      />

      <section className="relative px-5 pb-16 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1380px] gap-14 pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: revealEase }}
            className="max-w-[40rem]"
          >
            <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl">
              Para quem o Viexon foi criado
            </div>
            <h1 className="font-display mt-8 text-balance text-[clamp(3.1rem,7vw,5.9rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              Um sistema para quem precisa
              <span className="block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                vender, operar e decidir com clareza.
              </span>
            </h1>
            <p className="mt-7 max-w-[35rem] text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              O Viexon faz sentido para perfis diferentes, mas conectados no mesmo ecossistema:
              revendedoras, clientes, operação comercial e gestão. Cada um entra por uma necessidade
              distinta e ganha valor quando a rotina roda na mesma base.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#hero-cta"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
              >
                Começar com o Viexon
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_40px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
              >
                Ver recursos da plataforma
              </Link>
            </div>
          </motion.div>

          <AudienceOrbit />
        </div>
      </section>

      <section className="relative px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-6 py-5 shadow-[0_28px_90px_var(--shadow-soft)] backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Perfis que convivem no mesmo ecossistema
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {["Revendedoras", "Clientes", "Operação comercial", "Gestão"].map((item) => (
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
          <div className="max-w-[42rem]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Perfis atendidos
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.4rem,4.8vw,4.6rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
              O Viexon não atende um único ponto da operação. Ele conecta quem faz a operação existir.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {audienceProfiles.map((profile, index) => (
              <motion.article
                key={profile.title}
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
                    {profile.kicker}
                  </p>
                  <div className="mt-5 flex items-start justify-between gap-5">
                    <h3 className="font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--text-primary)]">
                      {profile.title}
                    </h3>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] text-sm font-semibold text-[var(--accent-primary)]">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
                    {profile.description}
                  </p>
                  <div className="mt-6 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4">
                    <p className="text-sm leading-7 text-[var(--text-primary)]">{profile.value}</p>
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {profile.points.map((item) => (
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
              Como cada perfil se encaixa
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.2rem,4.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              O produto faz sentido porque cada perfil ocupa um lugar claro na operação.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
              O Viexon organiza acesso, contexto e leitura de acordo com o papel do usuário. Isso
              evita ruído, protege dados e melhora a experiência para quem vende, acompanha,
              administra ou toma decisão.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-8">
            <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--accent-primary)] to-transparent opacity-40 sm:left-10" />
            <div className="space-y-8">
              {ecosystemFlow.map((item, index) => (
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {fitMatrix.map((item, index) => (
              <motion.div
                key={item.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.08 + index * 0.05, ease: revealEase }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="rounded-[1.7rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5"
              >
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  {item.label}
                </p>
                <h3 className="font-display mt-3 text-[1.3rem] tracking-[-0.04em] text-[var(--text-primary)]">
                  {item.emphasis}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
              </motion.div>
            ))}
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
            Clareza de posicionamento
          </p>
          <h2 className="font-display mt-5 max-w-[15ch] text-balance text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
            O Viexon funciona melhor quando cada perfil sabe exatamente seu lugar no fluxo.
          </h2>
          <p className="mt-5 max-w-[42rem] text-lg leading-8 text-[var(--text-secondary)]">
            Esta página mostra quem faz parte do ecossistema. A próxima camada é traduzir isso em
            experiência de acesso, onboarding e uso no produto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_44px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Ver landing principal
            </Link>
            <Link
              href="/recursos"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
            >
              Explorar recursos
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
