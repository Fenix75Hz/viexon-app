import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { getFriendlyAuthErrorMessage } from "@/lib/auth/map-auth-error-message";
import {
  getPendingOnboardingFallbackMessage,
  resolvePendingOnboarding,
} from "@/lib/auth/pending-onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(requestUrl: string, path: string, message?: string) {
  const url = new URL(path, requestUrl);

  if (message) {
    url.searchParams.set("erro", message);
  }

  return url;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const code = requestUrl.searchParams.get("code");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/auth/redirecionar";
  const supabase = await createSupabaseServerClient();

  async function finalizeRedirect() {
    try {
      const resolution = await resolvePendingOnboarding(supabase);

      if (
        resolution.status === "signed-out" ||
        resolution.status === "missing-metadata" ||
        resolution.status === "manual-provisioning"
      ) {
        return NextResponse.redirect(
          buildRedirect(
            request.url,
            "/cadastro/completar",
            getPendingOnboardingFallbackMessage(resolution.status),
          ),
        );
      }

      return NextResponse.redirect(buildRedirect(request.url, nextPath));
    } catch (error) {
      return NextResponse.redirect(
        buildRedirect(
          request.url,
          "/cadastro/completar",
          getFriendlyAuthErrorMessage(error),
        ),
      );
    }
  }

  if (errorDescription) {
    return NextResponse.redirect(
      buildRedirect(
        request.url,
        "/login",
        errorDescription.replaceAll("+", " "),
      ),
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return finalizeRedirect();
    }

    return NextResponse.redirect(
      buildRedirect(
        request.url,
        "/login",
        getFriendlyAuthErrorMessage(error),
      ),
    );
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return finalizeRedirect();
    }

    return NextResponse.redirect(
      buildRedirect(
        request.url,
        "/login",
        getFriendlyAuthErrorMessage(error),
      ),
    );
  }

  return NextResponse.redirect(
    buildRedirect(
      request.url,
      "/login",
      "O link de confirmacao e invalido ou expirou. Solicite um novo acesso.",
    ),
  );
}
