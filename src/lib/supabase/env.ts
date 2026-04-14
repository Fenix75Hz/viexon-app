function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
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
