import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CurrentUserContext, UserRole } from "@/types/database";

function isMissingAuthSessionError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
        ? error.message
        : "";
  const normalizedMessage = message.toLowerCase();

  if (error instanceof Error) {
    return (
      error.name === "AuthSessionMissingError" ||
      normalizedMessage.includes("auth session missing") ||
      normalizedMessage.includes("sub claim in jwt") ||
      normalizedMessage.includes("jwt expired") ||
      normalizedMessage.includes("refresh token")
    );
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    (normalizedMessage.includes("auth session missing") ||
      normalizedMessage.includes("sub claim in jwt") ||
      normalizedMessage.includes("jwt expired") ||
      normalizedMessage.includes("refresh token"))
  );
}

export const getCurrentUserContext = cache(async (): Promise<CurrentUserContext | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    if (isMissingAuthSessionError(authError)) {
      return null;
    }

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
