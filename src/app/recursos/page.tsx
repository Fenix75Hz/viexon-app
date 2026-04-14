import type { Metadata } from "next";

import { ResourcesPage } from "@/components/resources/resources-page";

export const metadata: Metadata = {
  title: "Viexon | Recursos",
  description:
    "Conheça os recursos do Viexon para pedidos, estoque, clientes, consignado, financeiro, relatórios e operação comercial.",
};

export default function Recursos() {
  return <ResourcesPage />;
}
