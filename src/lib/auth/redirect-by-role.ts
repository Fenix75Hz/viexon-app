import { redirect } from "next/navigation";

import { getCurrentUserContext } from "./get-current-user-role";

type RedirectByRoleOptions = {
  customerPath?: string;
  inactivePath?: string;
  onboardingPath?: string;
  resellerPath?: string;
  signedOutPath?: string;
};

export async function redirectByRole(options: RedirectByRoleOptions = {}) {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect(options.signedOutPath ?? "/login");
  }

  if (!context.is_active) {
    redirect(options.inactivePath ?? "/login");
  }

  if (!context.role || !context.onboarding_completed) {
    redirect(options.onboardingPath ?? "/cadastro/completar");
  }

  redirect(context.role === "reseller" ? options.resellerPath ?? "/revendedora" : options.customerPath ?? "/cliente");
}
