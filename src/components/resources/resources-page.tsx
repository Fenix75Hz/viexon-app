"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { siteNavigationItems } from "@/components/site/navigation";
import { SiteHeader } from "@/components/site/site-header";

type ResourceKey =
  | "pedidos"
  | "estoque"
  | "clientes"
  | "consignado"
  | "financeiro"
  | "relatorios"
  | "operacao";

type ResourceModule = {
  key: ResourceKey;
  title: string;
  kicker: string;
  summary: string;
  valuePoints: string[];
  idealFor: string[];
  capabilities: { title: string; description: string }[];
  connections: { label: string; detail: string }[];
};

const resourceModules: ResourceModule[] = [
  {
    key: "pedidos",
    title: "Pedidos",
    kicker: "Ritmo comercial sob controle",
    summary:
      "Um fluxo de pedido que preserva contexto e reduz retrabalho — com status claro para quem vende, para quem opera e para quem acompanha.",
    valuePoints: [
      "Menos improviso: status e histórico ficam legíveis.",
      "Mais consistência: a operação não depende de mensagens soltas.",
      "Mais confiança: o atendimento não perde contexto no meio do caminho.",
    ],
    idealFor: [
      "Você precisa de acompanhamento real de status (sem planilhas paralelas).",
      "Seu volume cresceu e o “controle manual” começou a quebrar a experiência.",
      "Você quer reduzir divergência entre comercial e operação.",
    ],
    capabilities: [
      {
        title: "Linha do tempo do pedido",
        description: "Visão por etapa para reduzir ruído e acelerar decisões na rotina.",
      },
      {
        title: "Histórico e contexto",
        description: "A operação sabe o que foi combinado — sem depender de conversa dispersa.",
      },
      {
        title: "Cadência comercial",
        description: "Prioridades e próximos passos claros para manter ritmo com presença.",
      },
    ],
    connections: [
      { label: "Clientes", detail: "Relacionamento e histórico conectados ao pedido real." },
      { label: "Estoque", detail: "Disponibilidade e separação com leitura coerente." },
      { label: "Financeiro", detail: "Acertos e fluxo ligados ao que foi executado." },
    ],
  },
  {
    key: "estoque",
    title: "Estoque",
    kicker: "Disponibilidade real, sem ruído",
    summary:
      "Controle de disponibilidade pensado para quem precisa operar com precisão — sem conferência duplicada e sem dependência de controles paralelos.",
    valuePoints: [
      "Mais precisão operacional: menos ruptura e mais previsibilidade.",
      "Menos divergência: leitura única entre quem vende e quem executa.",
      "Mais clareza: giro e reposição com sinalização prática.",
    ],
    idealFor: [
      "Você precisa confiar no que está disponível sem “checagem manual”.",
      "Seu estoque impacta diretamente consignado e pedidos.",
      "Você quer reduzir perda por divergência e retrabalho.",
    ],
    capabilities: [
      {
        title: "Leitura por etapa",
        description: "O que está disponível, comprometido e em trânsito — sem confusão.",
      },
      {
        title: "Reposição com sinal",
        description: "Indícios de giro e necessidade de ação para manter ritmo comercial.",
      },
      {
        title: "Consistência operacional",
        description: "Menos “versões” do estoque circulando entre áreas e pessoas.",
      },
    ],
    connections: [
      { label: "Pedidos", detail: "Separação e status respondem ao estoque real." },
      { label: "Consignado", detail: "Saídas/retornos conectados ao controle de itens." },
      { label: "Relatórios", detail: "Leitura de giro e impacto no resultado." },
    ],
  },
  {
    key: "clientes",
    title: "Clientes",
    kicker: "Relacionamento com contexto",
    summary:
      "Cadastro e histórico organizados para sustentar atendimento premium e decisões comerciais melhores — com continuidade, não apenas dados.",
    valuePoints: [
      "Mais qualidade no atendimento: histórico e contexto acessíveis.",
      "Mais consistência: recorrência e relacionamento com leitura rápida.",
      "Mais clareza: carteira organizada para priorizar com precisão.",
    ],
    idealFor: [
      "Seu atendimento depende de relacionamento e continuidade.",
      "Você precisa manter carteira organizada sem perder o toque premium.",
      "Você quer reduzir “perda de contexto” na rotina.",
    ],
    capabilities: [
      {
        title: "Carteira com leitura rápida",
        description: "Quem é prioridade, o que está em aberto e o próximo passo.",
      },
      {
        title: "Histórico do relacionamento",
        description: "Menos ruído em follow-ups e mais coerência no atendimento.",
      },
      {
        title: "Recorrência e consistência",
        description: "Base preparada para sustentar ritmo comercial sem improviso.",
      },
    ],
    connections: [
      { label: "Pedidos", detail: "Histórico comercial conectado ao pedido real." },
      { label: "Operação", detail: "A rotina executa com contexto e menos retrabalho." },
      { label: "Relatórios", detail: "Carteira e comportamento viram leitura prática." },
    ],
  },
  {
    key: "consignado",
    title: "Consignado",
    kicker: "Fluxo sensível com rastreio",
    summary:
      "Um fluxo de consignado que dá visibilidade de saídas, retornos e acertos — reduzindo perda de margem e ruído entre áreas.",
    valuePoints: [
      "Mais rastreabilidade: movimentação legível e acertos mais seguros.",
      "Menos divergência: menos confusão no que está com quem e por quê.",
      "Mais controle: um fluxo sensível tratado como deve ser.",
    ],
    idealFor: [
      "Você opera consignado e precisa de rastreio confiável.",
      "Você quer reduzir perdas por falta de visibilidade.",
      "Você precisa conectar retorno e acerto financeiro ao que foi movimentado.",
    ],
    capabilities: [
      {
        title: "Movimentação clara",
        description: "Saída, retorno e ajustes com leitura coerente e rastreável.",
      },
      {
        title: "Acerto com segurança",
        description: "Menos ruído na hora de fechar: o que voltou, o que ficou e o que falta.",
      },
      {
        title: "Operação sem improviso",
        description: "O fluxo não depende de conversa: responde no sistema.",
      },
    ],
    connections: [
      { label: "Estoque", detail: "Saída/retorno conectados ao controle de itens." },
      { label: "Financeiro", detail: "Acertos e fluxo ligados ao consignado real." },
      { label: "Relatórios", detail: "Leitura de margem e impacto operacional." },
    ],
  },
  {
    key: "financeiro",
    title: "Financeiro",
    kicker: "Saúde da operação com contexto",
    summary:
      "Leitura financeira conectada à operação comercial: entradas, acertos e compromissos com sinal claro do que está performando — e do que precisa ajuste.",
    valuePoints: [
      "Decisão mais confiável: leitura ligada ao que aconteceu na ponta.",
      "Mais consistência: menos conciliação manual e versões paralelas.",
      "Mais clareza: fluxo com sinalização prática para rotina e gestão.",
    ],
    idealFor: [
      "Você precisa enxergar caixa e acertos sem “montar relatórios à mão”.",
      "Seu financeiro depende de consignado, pedidos e execução.",
      "Você quer governança para crescer com menos improviso.",
    ],
    capabilities: [
      {
        title: "Leitura de fluxo",
        description: "Entradas e acertos com visão prática para acompanhar a operação.",
      },
      {
        title: "Menos conciliação manual",
        description: "Conectar execução e financeiro reduz a dependência de recortes paralelos.",
      },
      {
        title: "Base para decisão",
        description: "Informação com contexto para priorizar ações e ajustar processo.",
      },
    ],
    connections: [
      { label: "Pedidos", detail: "Resultado conectado ao que foi executado." },
      { label: "Consignado", detail: "Acertos respondem à movimentação real." },
      { label: "Relatórios", detail: "Leitura executiva com consistência." },
    ],
  },
  {
    key: "relatorios",
    title: "Relatórios",
    kicker: "Leitura executiva acionável",
    summary:
      "Transforme rotina em leitura prática: indicadores que ajudam a priorizar carteira, estoque, operação e resultado — com foco em decisão, não em dashboard decorativo.",
    valuePoints: [
      "Indicadores acionáveis: menos dado solto, mais direcionamento.",
      "Visão consolidada: leitura de ritmo, gargalos e resultado.",
      "Crescimento com controle: decisão baseada em operação real.",
    ],
    idealFor: [
      "Você precisa de leitura executiva sem montar planilhas manualmente.",
      "Você quer enxergar gargalos e ritmo com base em dados conectados.",
      "Você quer priorizar ações com clareza, não por sensação.",
    ],
    capabilities: [
      {
        title: "Indicadores com intenção",
        description: "O que importa para operar, ajustar e crescer — sem ruído.",
      },
      {
        title: "Ritmo e gargalos",
        description: "Leitura de cadência comercial e pontos de fricção na operação.",
      },
      {
        title: "Acompanhamento executivo",
        description: "Visão consolidada para gestão acompanhar sem depender de recortes.",
      },
    ],
    connections: [
      { label: "Operação", detail: "Relatórios respondem ao que acontece na ponta." },
      { label: "Financeiro", detail: "Resultado e fluxo com leitura consistente." },
      { label: "Estoque", detail: "Giro e impacto na rotina comercial." },
    ],
  },
  {
    key: "operacao",
    title: "Operação comercial",
    kicker: "Execução no dia a dia",
    summary:
      "O que sustenta a plataforma: a rotina que conecta comercial, controle e gestão. Menos retrabalho. Mais rastreabilidade. Mais previsibilidade.",
    valuePoints: [
      "Menos retrabalho: o fluxo reduz dependência de mensagens e planilhas.",
      "Mais rastreabilidade: cada etapa responde no sistema.",
      "Mais previsibilidade: as áreas trabalham com a mesma leitura.",
    ],
    idealFor: [
      "Sua rotina sofre com divergência e informação quebrada.",
      "Você precisa reduzir “passar informação” e aumentar rastreio.",
      "Você quer controlar o fluxo sem travar o time.",
    ],
    capabilities: [
      {
        title: "Fluxo conectado",
        description: "A rotina organiza a passagem entre etapas e áreas sem ruptura.",
      },
      {
        title: "Leitura de pendências",
        description: "O que precisa de ação aparece com clareza e menos ruído.",
      },
      {
        title: "Consistência entre áreas",
        description: "Menos divergência entre quem vende, quem executa e quem decide.",
      },
    ],
    connections: [
      { label: "Pedidos", detail: "Execução e status com leitura consistente." },
      { label: "Estoque", detail: "Separação e controle de itens no mesmo fluxo." },
      { label: "Relatórios", detail: "Leitura executiva conectada ao dia a dia." },
    ],
  },
];

const revealEase = [0.18, 1, 0.32, 1] as const;

function ResourceGlyph({
  moduleKey,
}: {
  moduleKey: ResourceKey;
}) {
  const sharedProps = {
    className: "h-5 w-5 fill-none stroke-current",
    "aria-hidden": true,
    viewBox: "0 0 24 24",
  } as const;

  switch (moduleKey) {
    case "pedidos":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="4.5" width="14" height="15" rx="2.5" strokeWidth="1.6" />
          <path d="M9 9.5h6M9 13h6M9 16.5h3.5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "estoque":
      return (
        <svg {...sharedProps}>
          <path d="M4.5 8.5 12 4l7.5 4.5L12 13 4.5 8.5Z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4.5 15.5 12 20l7.5-4.5M12 13v7" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "clientes":
      return (
        <svg {...sharedProps}>
          <path d="M9 11.4a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.4 12.4a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" strokeWidth="1.6" />
          <path
            d="M4.6 18.6c.7-2.3 2.6-3.5 5.2-3.5s4.5 1.2 5.2 3.5M14.6 18.6c.35-1.35 1.5-2.2 3.15-2.2 1.2 0 2.05.3 2.65 1"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "consignado":
      return (
        <svg {...sharedProps}>
          <path d="M7 7h10l2 4-7 9-7-9 2-4Z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.8 7 12 11l2.2-4" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "financeiro":
      return (
        <svg {...sharedProps}>
          <path d="M7.2 15.6v-3.2" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 15.6V8.8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16.8 15.6v-5" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6.6 18.3h10.8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "relatorios":
      return (
        <svg {...sharedProps}>
          <path d="M6 19.5V7.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8.8 10.2h6.4M8.8 13.4h6.4M8.8 16.6h4" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...sharedProps}>
          <path d="M7.2 14.3 6 12.2l1.2-2.1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.8 14.3 18 12.2l-1.2-2.1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.1 16.9h5.8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.1 7.5h5.8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M10.4 12.2h3.2" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

function ResourceConstellation() {
  const shouldReduceMotion = useReducedMotion();

  const sparkPoints = useMemo(() => {
    const sparkline = [22, 28, 24, 35, 32, 44, 38, 52] as const;
    const width = 240;
    const height = 64;
    const paddingX = 8;
    const paddingY = 10;
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = Math.max(1, max - min);
    const innerW = width - paddingX * 2;
    const innerH = height - paddingY * 2;

    return sparkline.map((value, index) => {
      const x = paddingX + (innerW * index) / (sparkline.length - 1);
      const normalized = (value - min) / range;
      const y = paddingY + innerH * (1 - normalized);
      return { x, y };
    });
  }, []);

  const sparkPath = useMemo(() => {
    const points = sparkPoints;
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    const smoothing = 0.18;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const prev = points[i - 1] ?? current;
      const afterNext = points[i + 2] ?? next;

      const cp1x = current.x + (next.x - prev.x) * smoothing;
      const cp1y = current.y + (next.y - prev.y) * smoothing;
      const cp2x = next.x - (afterNext.x - current.x) * smoothing;
      const cp2y = next.y - (afterNext.y - current.y) * smoothing;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return d;
  }, [sparkPoints]);

  const sparkArea = useMemo(() => {
    if (!sparkPath) return "";
    const last = sparkPoints.at(-1);
    const first = sparkPoints[0];
    if (!last || !first) return "";
    const baseline = 64 - 10;
    return `${sparkPath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
  }, [sparkPath, sparkPoints]);

  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-[36rem]">
      <motion.div
        animate={
          shouldReduceMotion ? undefined : { opacity: [0.78, 1, 0.86], scale: [1, 1.03, 1] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 18, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
        }
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
          <motion.span
            aria-hidden="true"
            animate={shouldReduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
            transition={
              shouldReduceMotion ? undefined : { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            }
            className="h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_18px_var(--accent-glow)]"
          />
        </div>
        <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute opacity-70"
            style={{
              inset: 0,
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 240 64"
            className="h-16 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="viexonSparkStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="viexonSparkFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.26" />
                <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.02" />
              </linearGradient>
              <filter id="viexonSparkGlow" x="-30%" y="-60%" width="160%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path d={sparkArea} fill="url(#viexonSparkFill)" />
            <motion.path
              d={sparkPath}
              fill="none"
              stroke="url(#viexonSparkStroke)"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#viexonSparkGlow)"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: revealEase }}
            />
            {sparkPoints.at(-1) ? (
              <>
                <circle
                  cx={sparkPoints.at(-1)!.x}
                  cy={sparkPoints.at(-1)!.y}
                  r="4.2"
                  fill="var(--accent-primary)"
                  opacity="0.95"
                />
                <motion.circle
                  cx={sparkPoints.at(-1)!.x}
                  cy={sparkPoints.at(-1)!.y}
                  r="8.5"
                  fill="var(--accent-primary)"
                  opacity="0.18"
                  animate={shouldReduceMotion ? undefined : { r: [8.5, 12, 8.5], opacity: [0.12, 0.22, 0.12] }}
                  transition={
                    shouldReduceMotion ? undefined : { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                  }
                />
              </>
            ) : null}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export function ResourcesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeKey, setActiveKey] = useState<ResourceKey>("pedidos");

  const activeModule = useMemo(
    () => resourceModules.find((item) => item.key === activeKey) ?? resourceModules[0],
    [activeKey],
  );

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
        loginHref="/login"
        primaryHref="/criar-conta"
        wrapperClassName="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8"
      />

      <section className="relative px-5 pb-14 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1380px] gap-14 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: revealEase }}
            className="max-w-[46rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)] shadow-[0_18px_48px_var(--shadow-soft)] backdrop-blur-xl">
              Recursos
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              Produto
            </div>

            <h1 className="font-display mt-8 text-balance text-[clamp(3.1rem,7vw,6.1rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
              Os módulos do Viexon foram desenhados para
              <span className="block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                reduzir ruído e aumentar leitura real na operação.
              </span>
            </h1>

            <p className="mt-7 max-w-[44rem] text-pretty text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              Aqui você não encontra “lista de features”. Você encontra recursos com intenção: cada
              módulo existe para sustentar um pedaço da rotina — e o valor aparece quando tudo se
              conecta em uma base única.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#modulos"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_54px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_var(--accent-glow)]"
              >
                Explorar módulos
              </Link>
              <Link
                href="/#hero-cta"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_40px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
              >
                Pedir demonstração
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {[
                "Pedidos com contexto",
                "Estoque com precisão",
                "Consignado rastreável",
                "Financeiro conectado",
                "Relatórios acionáveis",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <ResourceConstellation />
        </div>
      </section>

      <section id="modulos" className="relative scroll-mt-32 px-5 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="max-w-[50rem]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Módulos do produto
            </p>
            <h2 className="font-display mt-5 text-balance text-[clamp(2.35rem,4.8vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
              Escaneie rápido. Aprofunde com clareza.
            </h2>
            <p className="mt-6 max-w-[46rem] text-lg leading-8 text-[var(--text-secondary)]">
              Clique em um módulo para ver valor, sinais de fit e como ele se conecta ao resto da
              operação.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
              transition={{ duration: 0.66, ease: revealEase }}
              className="relative overflow-hidden rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[0_26px_80px_var(--shadow-soft)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,231,255,0.12),transparent_34%)] opacity-70" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                      Navegador de módulos
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      Menos cards, mais clareza: selecione um módulo e aprofunde.
                    </p>
                  </div>
                  <span className="hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)] sm:inline-flex">
                    {resourceModules.length} módulos
                  </span>
                </div>

                <div className="divide-y divide-[var(--border-soft)]">
                  {resourceModules.map((module) => {
                    const isActive = module.key === activeKey;
                    return (
                      <button
                        key={module.key}
                        type="button"
                        onClick={() => setActiveKey(module.key)}
                        className={`group flex w-full cursor-pointer items-start gap-4 px-6 py-5 text-left transition-[background-color] duration-300 ${
                          isActive ? "bg-[var(--surface-strong)]" : "hover:bg-[var(--surface-elevated)]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-[var(--surface-elevated)] text-[var(--accent-primary)] shadow-[0_16px_46px_var(--shadow-soft)] transition-transform duration-300 group-hover:scale-[1.03] ${
                            isActive ? "border-[var(--border-strong)]" : "border-[var(--border-soft)]"
                          }`}
                        >
                          <ResourceGlyph moduleKey={module.key} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <p className="font-display truncate text-[1.35rem] tracking-[-0.05em] text-[var(--text-primary)]">
                              {module.title}
                            </p>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                              {module.kicker}
                            </p>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--text-secondary)]">
                            {module.summary}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {module.connections.slice(0, 3).map((item) => (
                              <span
                                key={item.label}
                                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3.5 py-2 text-sm text-[var(--text-secondary)]"
                              >
                                {item.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                            isActive ? "bg-[var(--accent-primary)]" : "bg-[var(--border-soft)] group-hover:bg-[var(--border-strong)]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--surface-panel),var(--surface-elevated))] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(100,231,255,0.14),transparent_40%),radial-gradient(circle_at_78%_26%,rgba(33,111,255,0.12),transparent_44%)]"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.key}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: revealEase }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: -4, rotateX: 1.2, rotateY: -1.1 }
                  }
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                        {activeModule.kicker}
                      </p>
                      <h3 className="font-display mt-4 text-balance text-[2.2rem] leading-[1.02] tracking-[-0.06em] text-[var(--text-primary)] sm:text-[2.55rem]">
                        {activeModule.title}
                      </h3>
                      <p className="mt-4 max-w-[46rem] text-base leading-7 text-[var(--text-secondary)]">
                        {activeModule.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/#hero-cta"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_var(--accent-glow)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_64px_var(--accent-glow)]"
                      >
                        Ver demonstração
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                        Valor do módulo
                      </p>
                      <ul className="mt-4 space-y-3">
                        {activeModule.valuePoints.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                        Fit rápido
                      </p>
                      <ul className="mt-4 space-y-3">
                        {activeModule.idealFor.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {activeModule.capabilities.map((capability) => (
                      <div
                        key={capability.title}
                        className="rounded-[1.9rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 shadow-[0_18px_60px_var(--shadow-soft)]"
                      >
                        <p className="font-display text-[1.25rem] tracking-[-0.04em] text-[var(--text-primary)]">
                          {capability.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                          {capability.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                      Conexões que aumentam valor
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {activeModule.connections.map((connection) => (
                        <div
                          key={connection.label}
                          className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4"
                        >
                          <p className="font-display text-[1.1rem] tracking-[-0.04em] text-[var(--text-primary)]">
                            {connection.label}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                            {connection.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <div className="max-w-[38rem]">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
                Conexão entre módulos
              </p>
              <h2 className="font-display mt-5 text-balance text-[clamp(2.2rem,4.4vw,4.1rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
                O valor aparece quando a operação deixa de ser fragmentada.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
                Cada módulo sustenta uma parte. Mas o Viexon é desenhado para criar uma base única
                entre comercial, controle e gestão — com rastreabilidade e leitura executiva.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-8">
              <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--accent-primary)] to-transparent opacity-40 sm:left-10" />
              <div className="space-y-8">
                {[
                  {
                    title: "Vender com contexto",
                    description:
                      "Pedidos e clientes se conectam para manter continuidade no atendimento e reduzir improviso na carteira.",
                  },
                  {
                    title: "Controlar com rastreio",
                    description:
                      "Estoque e consignado respondem à operação real, reduzindo divergência e perda de margem.",
                  },
                  {
                    title: "Decidir com leitura real",
                    description:
                      "Financeiro e relatórios transformam execução em sinal prático para priorizar ações e ajustar processos.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
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

          <div className="mt-10 rounded-[2.4rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--surface-panel),var(--surface-elevated))] p-7 shadow-[0_34px_110px_var(--shadow-soft)] backdrop-blur-2xl sm:p-9">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
                  Fluxo de ponta a ponta
                </p>
                <h3 className="font-display mt-5 text-balance text-[clamp(2rem,3.8vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                  Do pedido ao resultado: um caminho que responde no mesmo lugar.
                </h3>
                <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
                  Um resumo do que o Viexon organiza quando a operação roda em uma base única.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { key: "pedidos", label: "Pedido entra", detail: "Status claro e histórico preservado." },
                  { key: "estoque", label: "Separação responde", detail: "Disponibilidade com leitura real." },
                  { key: "consignado", label: "Movimentação rastreada", detail: "Saídas, retornos e ajustes legíveis." },
                  { key: "financeiro", label: "Acerto conecta", detail: "Fluxo ligado à execução." },
                  { key: "relatorios", label: "Gestão enxerga", detail: "Indicadores acionáveis para priorizar." },
                  { key: "operacao", label: "Rotina fecha o ciclo", detail: "Menos ruído entre áreas e pessoas." },
                ].map((step, index) => (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => setActiveKey(step.key as ResourceKey)}
                    className="group cursor-pointer rounded-[1.9rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 text-left transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                  >
                    <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                      Etapa 0{index + 1}
                    </p>
                    <p className="font-display mt-3 text-[1.25rem] tracking-[-0.04em] text-[var(--text-primary)]">
                      {step.label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step.detail}</p>
                  </button>
                ))}
              </div>
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
            Se esses módulos descrevem sua rotina, o Viexon foi desenhado para esse tipo de operação.
          </h2>
          <p className="mt-5 max-w-[42rem] text-lg leading-8 text-[var(--text-secondary)]">
            Vá para a demonstração e mapeie seu cenário com o time — ou volte para a landing para ver
            a proposta completa de posicionamento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--nav-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[0_14px_44px_var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Ver posicionamento
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
