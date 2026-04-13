function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
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
