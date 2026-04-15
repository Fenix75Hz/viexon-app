import { redirect } from "next/navigation";

import { getCurrentUserContext } from "./get-current-user-role";
import { getFriendlyAuthErrorMessage } from "./map-auth-error-message";
import {
  getPendingOnboardingFallbackMessage,
  resolvePendingOnboarding,
} from "./pending-onboarding";

type RedirectByRoleOptions = {
  customerPath?: string;
  inactivePath?: string;
  onboardingPath?: string;
  resellerPath?: string;
  signedOutPath?: string;
};

export async function redirectByRole(options: RedirectByRoleOptions = {}) {
  let context = await getCurrentUserContext();

  if (!context) {
    redirect(options.signedOutPath ?? "/login");
  }

  if (!context.role || !context.onboarding_completed) {
    try {
      const resolution = await resolvePendingOnboarding();

      if (resolution.status === "completed" || resolution.status === "ready") {
        context = resolution.context;
      } else {
        redirect(
          `${options.onboardingPath ?? "/cadastro/completar"}?erro=${encodeURIComponent(
            getPendingOnboardingFallbackMessage(resolution.status),
          )}`,
        );
      }
    } catch (error) {
      redirect(
        `${options.onboardingPath ?? "/cadastro/completar"}?erro=${encodeURIComponent(
          getFriendlyAuthErrorMessage(error),
        )}`,
      );
    }
  }

  if (!context.is_active) {
    redirect(options.inactivePath ?? "/login");
  }

  redirect(context.role === "reseller" ? options.resellerPath ?? "/revendedora" : options.customerPath ?? "/cliente");
}
