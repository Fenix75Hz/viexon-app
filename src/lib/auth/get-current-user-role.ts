import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext, UserRole } from "@/types/database";

export const getCurrentUserContext = cache(async (): Promise<CurrentUserContext | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_my_user_context");

  if (error) {
    throw error;
  }

  return data[0] ?? null;
});

export const getCurrentUserRole = cache(async (): Promise<UserRole | null> => {
  const context = await getCurrentUserContext();

  return context?.role ?? null;
});
