"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthActionState, AuthFieldErrors } from "@/lib/auth/action-state";
import {
  checkRateLimit,
  formatRetryAfter,
  getClientFingerprint,
} from "@/lib/security/rate-limit";
import { getConfiguredAppOrigin, getSupabaseEnvStatus } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

import { getFriendlyAuthErrorMessage } from "./map-auth-error-message";
import {
  buildPendingOnboardingMetadata,
  completePendingOnboardingFromMetadata,
} from "./pending-onboarding";
import { createSupabaseAdminClient } from "../supabase/admin";

type AccountType = UserRole;

type LoginValues = {
  email: string;
  password: string;
};

type OnboardingValues = {
  accountType: AccountType | "";
  confirmPassword: string;
  email: string;
  fullName: string;
  password: string;
  phone: string;
  resellerPublicId: string;
  storeName: string;
};

const AUTH_RATE_LIMITS = {
  loginByEmail: {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  },
  loginByIp: {
    limit: 20,
    windowMs: 10 * 60 * 1000,
  },
  registerByEmail: {
    limit: 4,
    windowMs: 30 * 60 * 1000,
  },
  registerByIp: {
    limit: 8,
    windowMs: 30 * 60 * 1000,
  },
} as const;

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLogin(values: LoginValues): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  if (!values.email) {
    fieldErrors.email = "Informe seu e-mail.";
  } else if (!isValidEmail(values.email)) {
    fieldErrors.email = "Use um e-mail valido.";
  }

  if (!values.password) {
    fieldErrors.password = "Informe sua senha.";
  }

  return fieldErrors;
}

function validateOnboarding(values: OnboardingValues, requireCredentials: boolean): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  if (values.accountType !== "reseller" && values.accountType !== "customer") {
    fieldErrors.accountType = "Escolha como deseja continuar.";
  }

  if (!values.fullName) {
    fieldErrors.fullName = "Informe seu nome completo.";
  }

  if (!values.phone) {
    fieldErrors.phone = "Informe um telefone para contato.";
  }

  if (values.accountType === "reseller" && !values.storeName) {
    fieldErrors.storeName = "Informe o nome da loja ou nome comercial.";
  }

  if (values.accountType === "customer" && !values.resellerPublicId) {
    fieldErrors.resellerPublicId = "Selecione uma revendedora para concluir o cadastro.";
  }

  if (!requireCredentials) {
    return fieldErrors;
  }

  if (!values.email) {
    fieldErrors.email = "Informe seu e-mail.";
  } else if (!isValidEmail(values.email)) {
    fieldErrors.email = "Use um e-mail valido.";
  }

  if (!values.password) {
    fieldErrors.password = "Crie uma senha para continuar.";
  } else if (values.password.length < 8) {
    fieldErrors.password = "Use uma senha com pelo menos 8 caracteres.";
  }

  if (!values.confirmPassword) {
    fieldErrors.confirmPassword = "Confirme a senha.";
  } else if (values.confirmPassword !== values.password) {
    fieldErrors.confirmPassword = "As senhas nao coincidem.";
  }

  return fieldErrors;
}

function hasFieldErrors(fieldErrors: AuthFieldErrors) {
  return Object.keys(fieldErrors).length > 0;
}

function readOnboardingValues(formData: FormData): OnboardingValues {
  return {
    accountType: getStringValue(formData, "accountType") as AccountType | "",
    confirmPassword: getStringValue(formData, "confirmPassword"),
    email: getStringValue(formData, "email").toLowerCase(),
    fullName: getStringValue(formData, "fullName"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
    resellerPublicId: getStringValue(formData, "resellerPublicId"),
    storeName: getStringValue(formData, "storeName"),
  };
}

function getRequestOrigin(headerStore: Headers) {
  const configuredOrigin = getConfiguredAppOrigin();

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const originHeader = headerStore.get("origin");

  if (originHeader) {
    return originHeader;
  }

  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${protocol}://${host}`;
}

function createRateLimitState(message: string): AuthActionState {
  return {
    fieldErrors: {},
    message,
    status: "error",
  };
}

async function persistPendingOnboardingMetadata(
  userId: string,
  metadata: Record<string, unknown>,
) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return;
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (error) {
    throw error;
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return {
      fieldErrors: {},
      message: envStatus.message,
      status: "error",
    };
  }

  const values: LoginValues = {
    email: getStringValue(formData, "email").toLowerCase(),
    password: getStringValue(formData, "password"),
  };

  const fieldErrors = validateLogin(values);

  if (hasFieldErrors(fieldErrors)) {
    return {
      fieldErrors,
      message: "Revise os campos destacados para entrar.",
      status: "error",
    };
  }

  const headerStore = await headers();
  const fingerprint = getClientFingerprint(headerStore);
  const loginByIp = checkRateLimit({
    identifier: fingerprint,
    limit: AUTH_RATE_LIMITS.loginByIp.limit,
    scope: "auth:login:ip",
    windowMs: AUTH_RATE_LIMITS.loginByIp.windowMs,
  });

  if (!loginByIp.allowed) {
    return createRateLimitState(
      `Muitas tentativas de login. Aguarde ${formatRetryAfter(loginByIp.retryAfterMs)} e tente novamente.`,
    );
  }

  const loginByEmail = checkRateLimit({
    identifier: `${fingerprint}:${values.email}`,
    limit: AUTH_RATE_LIMITS.loginByEmail.limit,
    scope: "auth:login:email",
    windowMs: AUTH_RATE_LIMITS.loginByEmail.windowMs,
  });

  if (!loginByEmail.allowed) {
    return createRateLimitState(
      `Muitas tentativas para este e-mail. Aguarde ${formatRetryAfter(loginByEmail.retryAfterMs)} antes de tentar de novo.`,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return {
      fieldErrors: {},
      message: getFriendlyAuthErrorMessage(error),
      status: "error",
    };
  }

  redirect("/auth/redirecionar");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return {
      fieldErrors: {},
      message: envStatus.message,
      status: "error",
    };
  }

  const values = readOnboardingValues(formData);
  const fieldErrors = validateOnboarding(values, true);

  if (hasFieldErrors(fieldErrors)) {
    return {
      fieldErrors,
      message: "Revise os campos destacados para continuar.",
      status: "error",
    };
  }

  const headerStore = await headers();
  const fingerprint = getClientFingerprint(headerStore);
  const registerByIp = checkRateLimit({
    identifier: fingerprint,
    limit: AUTH_RATE_LIMITS.registerByIp.limit,
    scope: "auth:register:ip",
    windowMs: AUTH_RATE_LIMITS.registerByIp.windowMs,
  });

  if (!registerByIp.allowed) {
    return createRateLimitState(
      `Muitas tentativas de cadastro. Aguarde ${formatRetryAfter(registerByIp.retryAfterMs)} e tente novamente.`,
    );
  }

  const registerByEmail = checkRateLimit({
    identifier: `${fingerprint}:${values.email}`,
    limit: AUTH_RATE_LIMITS.registerByEmail.limit,
    scope: "auth:register:email",
    windowMs: AUTH_RATE_LIMITS.registerByEmail.windowMs,
  });

  if (!registerByEmail.allowed) {
    return createRateLimitState(
      `Este e-mail atingiu o limite de tentativas. Aguarde ${formatRetryAfter(registerByEmail.retryAfterMs)} antes de continuar.`,
    );
  }

  const supabase = await createSupabaseServerClient();
  const origin = getRequestOrigin(headerStore);
  const pendingOnboardingMetadata = buildPendingOnboardingMetadata({
    accountType: values.accountType as AccountType,
    fullName: values.fullName,
    phone: values.phone,
    resellerPublicId: values.resellerPublicId,
    storeName: values.storeName,
  });
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: pendingOnboardingMetadata,
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return {
      fieldErrors: {},
      message: getFriendlyAuthErrorMessage(error),
      status: "error",
    };
  }

  if (!data.user) {
    return {
      fieldErrors: {},
      message: "Nao foi possivel criar sua conta agora. Tente novamente.",
      status: "error",
    };
  }

  try {
    await persistPendingOnboardingMetadata(data.user.id, pendingOnboardingMetadata);
  } catch {
    // Supabase signUp already receives the same metadata. This admin update only hardens
    // production against providers that occasionally drop the initial payload.
  }

  if (!data.session) {
    return {
      fieldErrors: {},
      message:
        "Conta criada. Confirme seu e-mail para liberar o acesso automaticamente na plataforma.",
      status: "success",
    };
  }

  try {
    await completePendingOnboardingFromMetadata(pendingOnboardingMetadata, supabase);
  } catch (error) {
    return {
      fieldErrors: {},
      message:
        `Conta criada, mas o perfil ainda nao foi liberado. ${getFriendlyAuthErrorMessage(error)} ` +
        "Entre novamente em instantes para o sistema concluir automaticamente.",
      status: "error",
    };
  }

  redirect("/auth/redirecionar");
}
