function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeOrigin(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function readRequiredEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
): string {
  const value = process.env[name];

  if (!hasValue(value)) {
    throw new Error(`Missing required Supabase env: ${name}`);
  }

  return value ?? "";
}

export function getSupabaseEnvStatus() {
  const hasUrl = hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasUrl && hasAnonKey) {
    return {
      ready: true,
      message: "Variaveis publicas do Supabase encontradas.",
    };
  }

  return {
    ready: false,
    message: "Preencha .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  };
}

export function getSupabaseBrowserCredentials() {
  return {
    url: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getConfiguredAppOrigin() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    if (!hasValue(candidate)) {
      continue;
    }

    const origin = normalizeOrigin(candidate ?? "");

    if (origin) {
      return origin;
    }
  }

  return null;
}
