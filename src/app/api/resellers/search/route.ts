import { NextResponse } from "next/server";

import { searchResellers } from "@/lib/auth/search-resellers";
import { getFriendlyAuthErrorMessage } from "@/lib/auth/map-auth-error-message";
import {
  checkRateLimit,
  formatRetryAfter,
  getClientFingerprint,
} from "@/lib/security/rate-limit";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

const SEARCH_RATE_LIMIT = {
  limit: 30,
  windowMs: 60 * 1000,
} as const;

export async function GET(request: Request) {
  const envStatus = getSupabaseEnvStatus();

  if (!envStatus.ready) {
    return NextResponse.json(
      {
        error: envStatus.message,
        results: [],
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const clientFingerprint = getClientFingerprint(request.headers);
  const rateLimit = checkRateLimit({
    identifier: clientFingerprint,
    limit: SEARCH_RATE_LIMIT.limit,
    scope: "reseller-search:ip",
    windowMs: SEARCH_RATE_LIMIT.windowMs,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Busca temporariamente limitada. Aguarde ${formatRetryAfter(rateLimit.retryAfterMs)} e tente novamente.`,
        results: [],
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(Math.ceil(rateLimit.retryAfterMs / 1000), 1)),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  if (query.length < 2) {
    return NextResponse.json(
      { results: [] },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  try {
    const results = await searchResellers(query, 8);

    return NextResponse.json(
      { results },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: getFriendlyAuthErrorMessage(error),
        results: [],
      },
      {
        status: 500,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }
}
