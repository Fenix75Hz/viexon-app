import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PublicResellerSearchResult } from "@/types/database";

export async function searchResellers(
  searchTerm: string,
  resultLimit = 10,
): Promise<PublicResellerSearchResult[]> {
  const normalizedSearchTerm = searchTerm.trim();

  if (normalizedSearchTerm.length < 2) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_resellers", {
    search_term: normalizedSearchTerm,
    result_limit: resultLimit,
  });

  if (error) {
    throw error;
  }

  return data;
}
