"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { ViexonLogo } from "@/components/landing/viexon-logo";

type ResellerDashboardIdentity = {
  avatarInitials: string;
  displayName: string;
  email: string | null;
  firstName: string;
  publicId: string;
  storeName: string;
};

type ResellerDashboardProps = {
  generatedAt: string;
  greeting: string;
  identity: ResellerDashboardIdentity;
};

type IconName =
  | "api"
  | "bell"
  | "clients"
  | "code"
  | "consigned"
  | "dashboard"
  | "finance"
  | "inventory"
  | "orders"
  | "products"
  | "quick"
  | "reports"
  | "search"
  | "users"
  | "visit";

type MetricHighlight = {
  detail: string;
  icon: IconName;
  label: string;
  trendLabel: string;
  trendValue: string;
  value: string;
};

type MetricTile = {
  detail: string;
  icon: IconName;
  label: string;
  tone: "alert" | "neutral" | "positive";
  value: string;
};

type RevenuePoint = {
  label: string;
  orders: number;
  revenue: number;
};

type StatusItem = {
  color: string;
  count: number;
  label: string;
};

type MixChannel = {
  color: string;
  label: string;
  share: number;
  value: string;
};

type ReceiptPoint = {
  label: string;
  value: number;
};

type RankedItem = {
  delta: string;
  label: string;
  value: string;
  width: number;
};

type PendingOrder = {
  amount: string;
  client: string;
  deadline: string;
  id: string;
  stage: string;
};

type RiskItem = {
  amount: string;
  label: string;
  status: string;
};

type TimelineItem = {
  detail: string;
  time: string;
  title: string;
};

const modules = [
  { icon: "dashboard", label: "Dashboard", state: "active" },
  { icon: "products", label: "Produtos", state: "planned" },
  { icon: "clients", label: "Clientes", state: "planned" },
  { icon: "inventory", label: "Estoque", state: "planned" },
  { icon: "orders", label: "Pedidos", state: "planned" },
  { icon: "quick", label: "Pedido Rapido", state: "planned" },
  { icon: "consigned", label: "Consignado", state: "planned" },
  { icon: "visit", label: "Visita do Dia", state: "planned" },
  { icon: "quick", label: "Acerto Rapido", state: "planned" },
  { icon: "finance", label: "Financeiro", state: "planned" },
  { icon: "reports", label: "Relatorios", state: "planned" },
  { icon: "api", label: "API Docs", state: "planned" },
  { icon: "users", label: "Usuarios", state: "planned" },
] as const;

const metricHighlights: MetricHighlight[] = [
  {
    detail: "Meta diaria em 81% com 14 pedidos confirmados no turno da manha.",
    icon: "finance",
    label: "Faturamento do dia",
    trendLabel: "vs ontem",
    trendValue: "+12,4%",
    value: "R$ 4.860",
  },
  {
    detail: "Ritmo sustentado por pronta entrega, carteira recorrente e giro em consignado.",
    icon: "dashboard",
    label: "Faturamento do mes",
    trendLabel: "vs mes anterior",
    trendValue: "+18,1%",
    value: "R$ 92.340",
  },
];

const metricTiles: MetricTile[] = [
  {
    detail: "5 aguardando separacao e 3 em conferencia final.",
    icon: "orders",
    label: "Pedidos em aberto",
    tone: "neutral",
    value: "8",
  },
  {
    detail: "Fluxo concluido com ticket medio de R$ 486.",
    icon: "dashboard",
    label: "Pedidos finalizados",
    tone: "positive",
    value: "26",
  },
  {
    detail: "Carteira com recorrencia ativa nos ultimos 30 dias.",
    icon: "clients",
    label: "Clientes ativos",
    tone: "positive",
    value: "74",
  },
  {
    detail: "Pecas em posse de clientes com acerto previsto nos proximos 12 dias.",
    icon: "consigned",
    label: "Consignado na rua",
    tone: "neutral",
    value: "R$ 18.700",
  },
  {
    detail: "Quatro recebimentos concentram 63% do volume da semana.",
    icon: "finance",
    label: "Contas a receber",
    tone: "neutral",
    value: "R$ 12.480",
  },
  {
    detail: "SKU com maior risco: Vestido Aura, Blusa Atlas e Macacao Nuvem.",
    icon: "inventory",
    label: "Estoque baixo",
    tone: "alert",
    value: "5 itens",
  },
];

const revenueTrend: RevenuePoint[] = [
  { label: "01 Abr", orders: 7, revenue: 2800 },
  { label: "03 Abr", orders: 8, revenue: 3600 },
  { label: "05 Abr", orders: 10, revenue: 4200 },
  { label: "07 Abr", orders: 9, revenue: 3900 },
  { label: "09 Abr", orders: 11, revenue: 4700 },
  { label: "11 Abr", orders: 12, revenue: 5400 },
  { label: "13 Abr", orders: 14, revenue: 6180 },
  { label: "15 Abr", orders: 13, revenue: 5860 },
  { label: "17 Abr", orders: 16, revenue: 6920 },
  { label: "19 Abr", orders: 15, revenue: 6480 },
  { label: "21 Abr", orders: 18, revenue: 7440 },
  { label: "23 Abr", orders: 19, revenue: 8120 },
  { label: "25 Abr", orders: 18, revenue: 7860 },
  { label: "27 Abr", orders: 20, revenue: 8540 },
  { label: "29 Abr", orders: 22, revenue: 9280 },
];

const orderStatus: StatusItem[] = [
  { color: "from-cyan-400 to-sky-500", count: 8, label: "Em aberto" },
  { color: "from-blue-400 to-indigo-500", count: 5, label: "Separacao" },
  { color: "from-emerald-400 to-teal-500", count: 3, label: "Em rota" },
  { color: "from-fuchsia-400 to-pink-500", count: 26, label: "Finalizado" },
];

const salesMix: MixChannel[] = [
  { color: "#64e7ff", label: "Pronta entrega", share: 58, value: "R$ 53.560" },
  { color: "#3c82ff", label: "Consignado", share: 42, value: "R$ 38.780" },
];

const weeklyReceipts: ReceiptPoint[] = [
  { label: "Sem 1", value: 3480 },
  { label: "Sem 2", value: 4290 },
  { label: "Sem 3", value: 2710 },
  { label: "Sem 4", value: 5980 },
];

const topClients: RankedItem[] = [
  { delta: "+22%", label: "Ana Paula", value: "R$ 12.460", width: 100 },
  { delta: "+16%", label: "Carla Mendes", value: "R$ 10.380", width: 84 },
  { delta: "+12%", label: "Juliana Prado", value: "R$ 8.940", width: 73 },
  { delta: "+9%", label: "Marina Costa", value: "R$ 7.620", width: 64 },
  { delta: "+7%", label: "Patricia Nunes", value: "R$ 6.880", width: 58 },
];

const categoryPerformance: RankedItem[] = [
  { delta: "38%", label: "Vestidos", value: "R$ 35.200", width: 100 },
  { delta: "27%", label: "Conjuntos", value: "R$ 24.900", width: 71 },
  { delta: "19%", label: "Acessorios", value: "R$ 17.540", width: 50 },
  { delta: "16%", label: "Basicos", value: "R$ 14.700", width: 42 },
];

const topProducts: RankedItem[] = [
  { delta: "42 un", label: "Vestido Aura", value: "R$ 8.820", width: 100 },
  { delta: "31 un", label: "Blusa Atlas", value: "R$ 6.230", width: 75 },
  { delta: "28 un", label: "Conjunto Selene", value: "R$ 5.480", width: 68 },
  { delta: "24 un", label: "Calca Prisma", value: "R$ 4.920", width: 59 },
];

const stagnantProducts: RiskItem[] = [
  { amount: "61 dias sem giro", label: "Saia Celine", status: "Risco alto" },
  { amount: "48 dias sem giro", label: "Blazer Aurora", status: "Parado" },
  { amount: "39 dias sem giro", label: "Body Lume", status: "Atenção" },
];

const pendingOrders: PendingOrder[] = [
  { amount: "R$ 860", client: "Ana Paula", deadline: "Separar ate 10:30", id: "#P-2148", stage: "Separacao" },
  { amount: "R$ 1.240", client: "Carla Mendes", deadline: "Conferir ate 11:15", id: "#P-2152", stage: "Conferencia" },
  { amount: "R$ 570", client: "Marina Costa", deadline: "Enviar ate 13:00", id: "#P-2154", stage: "Expedicao" },
  { amount: "R$ 1.960", client: "Juliana Prado", deadline: "Liberar ate 15:30", id: "#P-2157", stage: "Separacao" },
];

const overdueClients: RiskItem[] = [
  { amount: "R$ 1.180", label: "Renata Lima", status: "8 dias em atraso" },
  { amount: "R$ 740", label: "Bruna Salles", status: "11 dias em atraso" },
  { amount: "R$ 2.340", label: "Patricia Nunes", status: "14 dias em atraso" },
];

const consignedDue: RiskItem[] = [
  { amount: "R$ 2.800", label: "Luciana Rocha", status: "Vence em 2 dias" },
  { amount: "R$ 1.950", label: "Camila Diniz", status: "Vence amanha" },
  { amount: "R$ 1.240", label: "Marcia Reis", status: "Retorno em 3 dias" },
];

const todayVisits: RiskItem[] = [
  { amount: "10:30", label: "Ana Paula", status: "Colecao outono" },
  { amount: "14:00", label: "Marina Costa", status: "Reposicao pronta entrega" },
  { amount: "17:15", label: "Juliana Prado", status: "Acerto consignado" },
];

const movementTimeline: TimelineItem[] = [
  { detail: "Pedido #2147 faturado e enviado para a rota centro.", time: "08:12", title: "Expedicao concluida" },
  { detail: "Cliente Carla Mendes confirmou reposicao de 12 pecas.", time: "09:05", title: "Pedido confirmado" },
  { detail: "Acerto parcial do consignado de Luciana Rocha registrado.", time: "09:42", title: "Financeiro atualizado" },
  { detail: "Blusa Atlas entrou em faixa de estoque critico.", time: "10:08", title: "Alerta de estoque" },
];

const upcomingReceipts: RiskItem[] = [
  { amount: "Quarta", label: "Carla Mendes", status: "R$ 2.680" },
  { amount: "Quinta", label: "Ana Paula", status: "R$ 1.920" },
  { amount: "Sexta", label: "Marina Costa", status: "R$ 1.460" },
  { amount: "Segunda", label: "Juliana Prado", status: "R$ 3.240" },
];

const financeAlerts = [
  "3 clientes estao com pagamento pendente ha mais de 7 dias.",
  "O maior risco da semana esta concentrado em 2 recebimentos acima de R$ 2 mil.",
  "Consignado representa 42% da receita do mes e exige rodada de acerto na sexta.",
];

const stockAlerts = [
  "Vestido Aura e Blusa Atlas precisam de reposicao ainda hoje.",
  "5 produtos estao abaixo da cobertura minima de 7 dias.",
  "3 itens parados ha mais de 40 dias podem entrar em campanha de giro.",
];

const strategicInsights = [
  "Seu faturamento subiu 18% em relacao a semana passada.",
  "Ana Paula lidera em compras no periodo com R$ 12.460.",
  "Pronta entrega puxa 58% da receita e melhora o caixa de curto prazo.",
  "Cinco SKUs concentram 49% do volume vendido no mes.",
];

const recentOrders = [
  { amount: "R$ 860", client: "Ana Paula", id: "#2158", status: "Confirmado" },
  { amount: "R$ 540", client: "Paula Freire", id: "#2156", status: "Separacao" },
  { amount: "R$ 1.120", client: "Carla Mendes", id: "#2155", status: "Em rota" },
  { amount: "R$ 970", client: "Marina Costa", id: "#2153", status: "Finalizado" },
];

const metricSparklineA = [26, 28, 31, 30, 35, 39, 42, 46];
const metricSparklineB = [52, 55, 58, 61, 66, 72, 79, 84];

const motionEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: motionEase,
    },
  },
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function createLineGeometry(values: number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const normalized = (value - min) / range;
    const y = height - normalized * height;

    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return {
    areaPath,
    linePath,
    points,
  };
}

function DashboardIcon({ name }: { name: IconName }) {
  const sharedProps = {
    "aria-hidden": true,
    className: "h-[18px] w-[18px] stroke-current",
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <path d="M4.5 7.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2V11a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2Zm0 9a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2Zm8-6a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2Zm0-5a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2v1.5a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2Z" />
        </svg>
      );
    case "products":
      return (
        <svg {...sharedProps}>
          <path d="m4.5 8.5 7.5-4 7.5 4-7.5 4-7.5-4Z" />
          <path d="M4.5 8.5V16l7.5 4 7.5-4V8.5M12 12.5V20" />
        </svg>
      );
    case "clients":
      return (
        <svg {...sharedProps}>
          <path d="M9 11.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm7 1.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" />
          <path d="M4.5 19.25c.7-2.42 2.73-3.75 5.5-3.75s4.8 1.33 5.5 3.75M15 18.75c.4-1.55 1.6-2.45 3.38-2.45 1.2 0 2.08.33 2.62 1.02" />
        </svg>
      );
    case "inventory":
      return (
        <svg {...sharedProps}>
          <path d="M5.25 7.5h13.5v10.5a2 2 0 0 1-2 2H7.25a2 2 0 0 1-2-2Z" />
          <path d="M8 7.5V6.25A2.75 2.75 0 0 1 10.75 3.5h2.5A2.75 2.75 0 0 1 16 6.25V7.5M9.5 12h5" />
        </svg>
      );
    case "orders":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="4.5" width="14" height="15" rx="2.5" />
          <path d="M9 9.25h6M9 12.5h6M9 15.75h3.5" />
        </svg>
      );
    case "quick":
      return (
        <svg {...sharedProps}>
          <path d="M12 3.75 6.25 13h4l-1 7.25L17.75 11h-4l1-7.25Z" />
        </svg>
      );
    case "consigned":
      return (
        <svg {...sharedProps}>
          <path d="M7 6.25h10l2.25 4.5L12 20.25l-7.25-9.5L7 6.25Z" />
          <path d="M9.5 6.25 12 10.75l2.5-4.5" />
        </svg>
      );
    case "visit":
      return (
        <svg {...sharedProps}>
          <path d="M12 20.25s5.25-4.9 5.25-9.25a5.25 5.25 0 1 0-10.5 0c0 4.35 5.25 9.25 5.25 9.25Z" />
          <path d="M12 13.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
        </svg>
      );
    case "finance":
      return (
        <svg {...sharedProps}>
          <path d="M4.5 7.25h15v9.5h-15Z" />
          <path d="M4.5 10.5h15M8.25 15h2.5M14 15h1.75" />
        </svg>
      );
    case "reports":
      return (
        <svg {...sharedProps}>
          <path d="M6 19.25h12.25M8.5 16.25V11m4 5.25V7.5m4 8.75v-4.5" />
        </svg>
      );
    case "api":
    case "code":
      return (
        <svg {...sharedProps}>
          <path d="m9.25 8.25-4 3.75 4 3.75M14.75 8.25l4 3.75-4 3.75M13 5.75l-2 12.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...sharedProps}>
          <path d="M12 11.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
          <path d="M5 20.25c1.05-3.17 3.4-4.75 7-4.75s5.95 1.58 7 4.75" />
        </svg>
      );
    case "bell":
      return (
        <svg {...sharedProps}>
          <path d="M8 17.25h8.5l-1.25-1.5v-3.5a4.25 4.25 0 1 0-8.5 0v3.5L5.5 17.25H8Zm2.75 2.75a1.75 1.75 0 0 0 3.5 0" />
        </svg>
      );
    default:
      return (
        <svg {...sharedProps}>
          <path d="m18.75 18.75-3.7-3.7M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
        </svg>
      );
  }
}

function Panel({
  children,
  className,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  className?: string;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.section
      variants={itemVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              boxShadow: "0 32px 80px rgba(2, 10, 26, 0.68)",
              y: -3,
            }
      }
      transition={{ duration: 0.3, ease: motionEase }}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-slate-800 bg-slate-900/80 shadow-sm",
        className,
      )}
    >
      
      <div className="relative">{children}</div>
    </motion.section>
  );
}

function SectionHeader({
  caption,
  title,
  value,
}: {
  caption?: string;
  title: string;
  value?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {caption ? (
          <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-white/45">
            {caption}
          </p>
        ) : null}
        <h2 className="font-display mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-white">
          {title}
        </h2>
      </div>
      {value ? (
        <span className="rounded-full bg-slate-800 px-3 py-1 text-[0.75rem] font-medium text-slate-300 rounded-full">
          {value}
        </span>
      ) : null}
    </div>
  );
}

function MetricCard({
  detail,
  icon,
  label,
  shouldReduceMotion,
  trendLabel,
  trendValue,
  value,
}: MetricHighlight & { shouldReduceMotion: boolean }) {
  const series = label === "Faturamento do dia" ? metricSparklineA : metricSparklineB;

  return (
    <Panel shouldReduceMotion={shouldReduceMotion} className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-slate-300">
              <DashboardIcon name={icon} />
            </span>
            <div>
              <p className="text-sm font-medium text-white/64">{label}</p>
              <p className="mt-1 text-[0.72rem] uppercase tracking-wider text-cyan-100/70">
                {trendLabel}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-[2.3rem] font-semibold tracking-[-0.06em] text-white">
              {value}
            </p>
            <span className="mb-2 rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-xs font-medium rounded-full">
              {trendValue}
            </span>
          </div>
        </div>

        <div className="w-[116px] shrink-0">
          <MiniSparkline values={series} />
        </div>
      </div>

      <p className="mt-5 max-w-[34rem] text-sm leading-6 text-white/62">{detail}</p>
    </Panel>
  );
}

function MetricTileCard({
  detail,
  icon,
  label,
  shouldReduceMotion,
  tone,
  value,
}: MetricTile & { shouldReduceMotion: boolean }) {
  const toneClass =
    tone === "positive"
      ? "border-emerald-400/18 bg-emerald-400/10 text-emerald-100"
      : tone === "alert"
        ? "border-amber-300/22 bg-amber-300/10 text-amber-100"
        : "border-white/10 bg-white/[0.05] text-white/80";

  return (
    <Panel shouldReduceMotion={shouldReduceMotion} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/64">{label}</p>
          <p className="font-display mt-4 text-[1.72rem] font-semibold tracking-[-0.05em] text-white">
            {value}
          </p>
        </div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl border", toneClass)}>
          <DashboardIcon name={icon} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/52">{detail}</p>
    </Panel>
  );
}

function MiniSparkline({ values }: { values: number[] }) {
  const { areaPath, linePath } = createLineGeometry(values, 116, 52);

  return (
    <svg viewBox="0 0 116 52" className="h-[52px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(100,231,255,0.38)" />
          <stop offset="100%" stopColor="rgba(100,231,255,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparklineFill)" />
      <path d={linePath} stroke="#64e7ff" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

function RevenueChart() {
  const revenueGeometry = createLineGeometry(
    revenueTrend.map((point) => point.revenue),
    720,
    240,
  );
  const orderGeometry = createLineGeometry(
    revenueTrend.map((point) => point.orders),
    720,
    120,
  );

  const revenueLastPoint = revenueGeometry.points[revenueGeometry.points.length - 1];

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[#0F172A] px-4 py-5 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(100,231,255,0.04),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_100%,calc(100%/6)_100%,100%_calc(100%/5)] opacity-70" />
        <svg viewBox="0 0 720 260" className="relative h-[260px] w-full" aria-hidden="true">
          <defs>
            <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(100,231,255,0.42)" />
              <stop offset="100%" stopColor="rgba(100,231,255,0)" />
            </linearGradient>
            <linearGradient id="revenueLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64e7ff" />
              <stop offset="100%" stopColor="#3c82ff" />
            </linearGradient>
          </defs>
          <path d={revenueGeometry.areaPath} fill="url(#revenueAreaGradient)" transform="translate(0 8)" />
          <path d={revenueGeometry.linePath} transform="translate(0 8)" fill="none" stroke="url(#revenueLineGradient)" strokeWidth="3.5" />
          <path
            d={orderGeometry.linePath}
            transform="translate(0 110)"
            fill="none"
            stroke="rgba(168,202,255,0.52)"
            strokeDasharray="6 8"
            strokeWidth="2"
          />
          <circle cx={revenueLastPoint.x} cy={revenueLastPoint.y + 8} r="6" fill="#64e7ff" />
          <circle cx={revenueLastPoint.x} cy={revenueLastPoint.y + 8} r="13" fill="rgba(100,231,255,0.16)" />
        </svg>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-5">
            {[
              { label: "Ultimos 30 dias", value: "R$ 92.340" },
              { label: "Ticket medio", value: "R$ 486" },
              { label: "Conversao", value: "62%" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[0.72rem] uppercase tracking-wider text-white/40">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-white/42">
            {revenueTrend.slice(-5).map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Pedidos no pico", value: "22 pedidos", detail: "29 Abr" },
          { label: "Melhor dia de caixa", value: "R$ 9.280", detail: "29 Abr" },
          { label: "Media diaria", value: "R$ 6.156", detail: "ultimos 15 dias" },
        ].map((item) => (
          <div key={item.label} className="rounded-[22px] border border-slate-800/60 bg-slate-800/40 px-4 py-4">
            <p className="text-[0.7rem] uppercase tracking-wider text-white/40">{item.label}</p>
            <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-white/48">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarPanel() {
  const totalOrders = orderStatus.reduce((sum, item) => sum + item.count, 0);
  const maxCategoryWidth = Math.max(...categoryPerformance.map((item) => item.width));

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Mix comercial" title="Radar de vendas" value="Atualizado agora" />

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Pedidos por status</p>
        <div className="mt-4 space-y-3">
          {orderStatus.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-white/64">{item.label}</span>
                <span className="font-medium text-white">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-white/8">
                <div
                  className={cn("h-2 rounded-full bg-gradient-to-r", item.color)}
                  style={{ width: `${(item.count / totalOrders) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Pronta entrega x consignado</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
          {salesMix.map((channel) => (
            <div
              key={channel.label}
              className="h-full"
              style={{
                background: channel.color,
                float: "left",
                width: `${channel.share}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {salesMix.map((channel) => (
            <div key={channel.label} className="rounded-[20px] border border-slate-800 bg-slate-900/60 px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: channel.color }} />
                <p className="text-sm font-medium text-white/72">{channel.label}</p>
              </div>
              <p className="mt-3 text-xl font-semibold text-white">{channel.share}%</p>
              <p className="mt-1 text-sm text-white/48">{channel.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Desempenho por categoria</p>
        <div className="mt-4 space-y-3">
          {categoryPerformance.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="text-white/64">{item.label}</span>
                <span className="text-white">{item.delta}</span>
              </div>
              <div className="h-2 rounded-full bg-white/8">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${(item.width / maxCategoryWidth) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShortTermFinancePanel() {
  const maxReceipt = Math.max(...weeklyReceipts.map((item) => item.value));

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Fluxo financeiro" title="Recebimentos previstos" value="4 proximos ciclos" />

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <div className="flex h-[180px] items-end gap-3">
          {weeklyReceipts.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-full w-full items-end rounded-[18px] bg-white/6 p-2">
                <div
                  className="w-full rounded-[12px] bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-300 shadow-none"
                  style={{ height: `${(item.value / maxReceipt) * 100}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">{formatCurrency(item.value)}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Proximos recebimentos</p>
        <div className="mt-4 space-y-3">
          {upcomingReceipts.map((item) => (
            <div key={`${item.label}-${item.amount}`} className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{item.amount}</p>
              </div>
              <span className="text-sm text-cyan-100">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AlertList title="Alertas financeiros" items={financeAlerts} />
        <AlertList title="Alertas de estoque" items={stockAlerts} />
      </div>
    </div>
  );
}

function AlertList({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-white/56">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-none" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationPanel() {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Operacao do dia" title="Prioridades imediatas" value="Atencao nas proximas 6h" />

      <div className="grid gap-4 xl:grid-cols-2">
        <ListBlock title="Pedidos pendentes" subtitle="Separacao, conferencia e envio">
          {pendingOrders.map((item) => (
            <div key={item.id} className="rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.id} • {item.client}
                  </p>
                  <p className="mt-1 text-sm text-white/48">{item.deadline}</p>
                </div>
                <span className="rounded-full bg-slate-800 text-slate-300 px-2.5 py-1 text-xs font-medium rounded-full">
                  {item.stage}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-white/76">{item.amount}</p>
            </div>
          ))}
        </ListBlock>

        <ListBlock title="Pagamentos em atraso" subtitle="Cobrar antes do fechamento da semana">
          {overdueClients.map((item) => (
            <RiskRow key={item.label} item={item} tone="alert" />
          ))}
        </ListBlock>

        <ListBlock title="Consignados proximos do vencimento" subtitle="Organizar acertos e recolhas">
          {consignedDue.map((item) => (
            <RiskRow key={item.label} item={item} tone="neutral" />
          ))}
        </ListBlock>

        <ListBlock title="Visitas agendadas" subtitle="Roteiro comercial de hoje">
          {todayVisits.map((item) => (
            <RiskRow key={item.label} item={item} tone="positive" />
          ))}
        </ListBlock>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Ultimas movimentacoes</p>
        <div className="mt-5 space-y-4">
          {movementTimeline.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex w-14 shrink-0 flex-col items-center">
                <span className="text-xs font-medium uppercase tracking-wider text-white/34">{item.time}</span>
                {index < movementTimeline.length - 1 ? (
                  <span className="mt-3 h-full w-px bg-gradient-to-b from-cyan-300/60 to-transparent" />
                ) : null}
              </div>
              <div className="rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/54">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListBlock({
  children,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/46">{subtitle}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function RiskRow({ item, tone }: { item: RiskItem; tone: "alert" | "neutral" | "positive" }) {
  const toneClass =
    tone === "positive"
      ? "bg-emerald-400"
      : tone === "alert"
        ? "bg-amber-300"
        : "bg-cyan-300";

  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full shadow-none", toneClass)} />
          <p className="truncate text-sm font-medium text-white">{item.label}</p>
        </div>
        <p className="mt-2 text-sm text-white/48">{item.status}</p>
      </div>
      <span className="text-sm font-medium text-white/80">{item.amount}</span>
    </div>
  );
}

function TopClientsPanel() {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Rankings" title="Top clientes do mes" value="Carteira mais ativa" />

      <div className="space-y-4">
        {topClients.map((item) => (
          <RankedBar key={item.label} item={item} />
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Leitura rapida</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Ticket da lider", value: "R$ 1.557" },
            { label: "Media carteira top 5", value: "R$ 9.256" },
          ].map((item) => (
            <div key={item.label} className="rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-4">
              <p className="text-[0.72rem] uppercase tracking-wider text-white/40">{item.label}</p>
              <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RankedBar({ item }: { item: RankedItem }) {
  return (
    <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{item.label}</p>
          <p className="mt-1 text-sm text-white/44">{item.delta}</p>
        </div>
        <p className="text-sm font-medium text-white/84">{item.value}</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/8">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500"
          style={{ width: `${item.width}%` }}
        />
      </div>
    </div>
  );
}

function ProductsPanel() {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Produtos" title="Mais vendidos e estoque parado" value="Giro do mes" />

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Produtos mais vendidos</p>
        <div className="mt-4 space-y-4">
          {topProducts.map((item) => (
            <RankedBar key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Produtos parados no estoque</p>
        <div className="mt-4 space-y-3">
          {stagnantProducts.map((item) => (
            <RiskRow key={item.label} item={item} tone="alert" />
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsPanel() {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader caption="Insights" title="Alertas e inteligencia comercial" value="4 sinais fortes" />

      <div className="rounded-[24px] border border-slate-800 bg-slate-900/60 p-4 shadow-none">
        <p className="text-[0.72rem] uppercase tracking-wider text-cyan-100/64">Resumo executivo</p>
        <p className="mt-4 font-display text-[1.6rem] font-semibold tracking-[-0.05em] text-white">
          Faturamento em alta com concentracao de risco no financeiro de curto prazo.
        </p>
        <p className="mt-4 text-sm leading-6 text-white/58">
          A operacao acelerou com pronta entrega e carteira top 5, mas o volume em consignado e os
          atrasos acima de 7 dias pedem rodada de cobranca e reposicao focada.
        </p>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Insights estrategicos</p>
        <div className="mt-4 space-y-3">
          {strategicInsights.map((item) => (
            <div key={item} className="rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm leading-6 text-white/62">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
        <p className="text-sm font-semibold text-white">Ultimos pedidos realizados</p>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {order.id} • {order.client}
                </p>
                <p className="mt-1 text-sm text-white/46">{order.status}</p>
              </div>
              <span className="text-sm font-medium text-white/80">{order.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResellerDashboard({
  generatedAt,
  greeting,
  identity,
}: ResellerDashboardProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const quickSummary = `Voce tem ${pendingOrders.length} pedidos pendentes, ${consignedDue.length} acertos de consignado e ${todayVisits.length} clientes para visitar hoje.`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
      

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={containerVariants}
        className="relative mx-auto max-w-[1680px] px-4 py-4 sm:px-5 lg:px-6 lg:py-6"
      >
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <motion.aside
            variants={itemVariants}
            className="hidden min-h-[calc(100svh-3rem)] flex-col rounded-[32px] border border-slate-800 bg-[linear-gradient(180deg,rgba(6,13,28,0.94),rgba(3,8,20,0.98))] p-5 shadow-[0_28px_90px_rgba(2,8,22,0.56)] lg:flex lg:sticky lg:top-6"
          >
            <div className="flex items-center justify-between gap-3">
              <Link href="/" aria-label="Viexon">
                <ViexonLogo />
              </Link>
              <span className="rounded-full border border-cyan-400/18 bg-slate-800 px-3 py-1 text-[0.65rem] font-medium text-slate-300">
                Revendedora
              </span>
            </div>

            <div className="mt-8 rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-white/38">
                Operacao atual
              </p>
              <p className="mt-3 font-display text-[1.45rem] font-semibold tracking-[-0.05em] text-white">
                {identity.storeName}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/52">
                Carteira ativa, caixa projetado e rotinas do dia no mesmo cockpit.
              </p>
            </div>

            <nav className="mt-8 flex-1 space-y-2">
              {modules.map((item) =>
                item.state === "active" ? (
                  <Link
                    key={item.label}
                    href="/revendedora"
                    className="group flex items-center justify-between rounded-[20px] border border-cyan-400/18 bg-cyan-400/12 px-4 py-3 text-sm font-medium text-white shadow-none"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/18 bg-[#091524] text-cyan-200">
                        <DashboardIcon name={item.icon} />
                      </span>
                      {item.label}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-cyan-100">
                      Ativo
                    </span>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    disabled
                    className="flex w-full items-center justify-between rounded-[20px] border border-slate-800/60 bg-slate-800/40 px-4 py-3 text-sm text-white/56"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-[#09111f] text-white/48">
                        <DashboardIcon name={item.icon} />
                      </span>
                      {item.label}
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-white/26">
                      Em breve
                    </span>
                  </button>
                ),
              )}
            </nav>

            <div className="rounded-[24px] border border-slate-800/60 bg-slate-800/40 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-white/38">
                Identificacao
              </p>
              <p className="mt-3 text-sm font-medium text-white">{identity.displayName}</p>
              <p className="mt-2 text-sm text-white/46">{identity.publicId}</p>
              <p className="mt-2 text-sm text-white/46">{identity.email ?? "E-mail principal conectado"}</p>
            </div>
          </motion.aside>

          <div className="min-w-0 space-y-4">
            <Panel shouldReduceMotion={shouldReduceMotion} className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-[44rem]">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100/58">
                    Dashboard da revendedora
                  </p>
                  <h1 className="font-display mt-4 text-[clamp(2.2rem,4.8vw,4rem)] font-semibold tracking-[-0.07em] text-white">
                    {greeting}, {identity.firstName}
                  </h1>
                  <p className="mt-4 max-w-[42rem] text-base leading-7 text-white/58">{quickSummary}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {[
                      "Meta diaria em 81%",
                      "3 cobrancas prioritarias",
                      "5 SKUs abaixo da cobertura minima",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs font-medium text-white/72"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full max-w-[480px] space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="relative flex-1">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/32">
                        <DashboardIcon name="search" />
                      </span>
                      <input
                        aria-label="Buscar no dashboard"
                        type="search"
                        placeholder="Buscar cliente, pedido, produto ou nota"
                        className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-900/50 pl-12 pr-4 text-sm text-white outline-none transition-[border-color,background-color] duration-300 placeholder:text-white/28 focus:border-cyan-400/24 focus:bg-white/[0.06]"
                      />
                    </label>

                    <button
                      aria-label="Abrir notificacoes"
                      type="button"
                      className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 text-white/72 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <DashboardIcon name="bell" />
                      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-none" />
                    </button>

                    <div className="flex h-12 min-w-[132px] items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-semibold text-slate-950">
                        {identity.avatarInitials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{identity.firstName}</p>
                        <p className="truncate text-xs text-white/44">Atualizado {generatedAt}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-800 bg-slate-800/40 px-4 py-4">
                    <p className="text-[0.72rem] uppercase tracking-wider text-cyan-100/56">Resumo do dia</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">{quickSummary}</p>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {modules.map((item) => (
                <span
                  key={item.label}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                    item.state === "active"
                      ? "border-cyan-400/20 bg-cyan-400/12 text-cyan-100"
                      : "border-white/8 bg-white/[0.03] text-white/48",
                  )}
                >
                  <DashboardIcon name={item.icon} />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="grid gap-4 xl:grid-cols-2">
                {metricHighlights.map((metric) => (
                  <MetricCard key={metric.label} {...metric} shouldReduceMotion={shouldReduceMotion} />
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {metricTiles.map((metric) => (
                  <MetricTileCard key={metric.label} {...metric} shouldReduceMotion={shouldReduceMotion} />
                ))}
              </div>
            </div>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)]">
              <Panel shouldReduceMotion={shouldReduceMotion} className="p-5 sm:p-6">
                <SectionHeader caption="Performance" title="Evolucao do faturamento" value="Ultimos 30 dias" />
                <RevenueChart />
              </Panel>

              <div className="space-y-4">
                <Panel shouldReduceMotion={shouldReduceMotion}>
                  <RadarPanel />
                </Panel>
                <Panel shouldReduceMotion={shouldReduceMotion}>
                  <ShortTermFinancePanel />
                </Panel>
              </div>
            </div>

            <Panel shouldReduceMotion={shouldReduceMotion}>
              <OperationPanel />
            </Panel>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.92fr)_minmax(0,0.96fr)_minmax(320px,0.72fr)]">
              <Panel shouldReduceMotion={shouldReduceMotion}>
                <TopClientsPanel />
              </Panel>
              <Panel shouldReduceMotion={shouldReduceMotion}>
                <ProductsPanel />
              </Panel>
              <Panel shouldReduceMotion={shouldReduceMotion}>
                <InsightsPanel />
              </Panel>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
