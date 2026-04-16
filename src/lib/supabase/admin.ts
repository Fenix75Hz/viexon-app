import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { getSupabaseAdminCredentials } from "./env";

export function createSupabaseAdminClient() {
  const credentials = getSupabaseAdminCredentials();

  if (!credentials) {
    return null;
  }

  return createClient<Database>(credentials.url, credentials.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
