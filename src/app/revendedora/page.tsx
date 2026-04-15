import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResellerDashboard } from "@/components/dashboard/reseller-dashboard";
import { getCurrentUserContext } from "@/lib/auth/get-current-user-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";
import type { CurrentUserContext } from "@/types/database";

export const metadata: Metadata = {
  title: "Viexon | Dashboard da revendedora",
  description: "Painel principal da revendedora com operacao, performance e inteligencia comercial.",
};

export const dynamic = "force-dynamic";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Bom dia";
  }

  if (hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "VX";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

async function getDashboardIdentity(context: CurrentUserContext) {
  const fallbackName = context.reseller_public_id ? `Revendedora ${context.reseller_public_id}` : "Revendedora";

  try {
    const supabase = await createSupabaseServerClient();

    const [profileResult, resellerResult] = await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", context.profile_id).maybeSingle(),
      supabase
        .from("resellers")
        .select("store_name, public_name, public_id")
        .eq("profile_id", context.profile_id)
        .maybeSingle(),
    ]);

    const fullName =
      profileResult.data?.full_name?.trim() ||
      resellerResult.data?.public_name?.trim() ||
      fallbackName;
    const firstName = fullName.split(/\s+/)[0] || "Revendedora";

    return {
      avatarInitials: getInitials(fullName),
      displayName: fullName,
      email: profileResult.data?.email ?? null,
      firstName,
      publicId: resellerResult.data?.public_id ?? context.reseller_public_id ?? "perfil-revendedora",
      storeName: resellerResult.data?.store_name?.trim() || "Operacao Viexon",
    };
  } catch {
    return {
      avatarInitials: getInitials(fallbackName),
      displayName: fallbackName,
      email: null,
      firstName: fallbackName.split(/\s+/)[0] || "Revendedora",
      publicId: context.reseller_public_id ?? "perfil-revendedora",
      storeName: "Operacao Viexon",
    };
  }
}

export default async function RevendedoraPage() {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    redirect("/login?erro=Preencha%20as%20variaveis%20publicas%20do%20Supabase%20para%20continuar.");
  }

  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  if (!context.is_active) {
    redirect("/login");
  }

  if (!context.role || !context.onboarding_completed) {
    redirect("/auth/redirecionar");
  }

  if (context.role !== "reseller") {
    redirect("/cliente");
  }

  const identity = await getDashboardIdentity(context);
  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <ResellerDashboard
      generatedAt={generatedAt}
      greeting={getGreeting()}
      identity={identity}
    />
  );
}
