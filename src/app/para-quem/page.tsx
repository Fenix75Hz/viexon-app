import type { Metadata } from "next";

import { AudiencePage } from "@/components/audience/audience-page";

export const metadata: Metadata = {
  title: "Viexon | Para quem",
  description:
    "Entenda para quais perfis o Viexon foi criado e como revendedoras, clientes, operação comercial e gestão se beneficiam da plataforma.",
};

export default function ParaQuemPage() {
  return <AudiencePage />;
}
