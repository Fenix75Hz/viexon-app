import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { getSupabaseBrowserCredentials } from "./env";

let browserClient: SupabaseClient<Database> | undefined;

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseBrowserCredentials();

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
