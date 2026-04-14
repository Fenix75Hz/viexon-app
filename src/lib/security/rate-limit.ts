type RateLimitOptions = {
  identifier: string;
  limit: number;
  scope: string;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
};

declare global {
  var __viexonRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore = globalThis.__viexonRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalThis.__viexonRateLimitStore) {
  globalThis.__viexonRateLimitStore = rateLimitStore;
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase().slice(0, 200) || "anonymous";
}

function cleanupExpiredEntries(now: number) {
  if (rateLimitStore.size < 500 && Math.random() > 0.03) {
    return;
  }

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit({
  identifier,
  limit,
  scope,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const key = `${scope}:${normalizeIdentifier(identifier)}`;
  const existingEntry = rateLimitStore.get(key);

  cleanupExpiredEntries(now);

  if (!existingEntry || existingEntry.resetAt <= now) {
    const nextEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };

    rateLimitStore.set(key, nextEntry);

    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - nextEntry.count, 0),
      resetAt: nextEntry.resetAt,
      retryAfterMs: 0,
    };
  }

  if (existingEntry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: existingEntry.resetAt,
      retryAfterMs: Math.max(existingEntry.resetAt - now, 0),
    };
  }

  existingEntry.count += 1;
  rateLimitStore.set(key, existingEntry);

  return {
    allowed: true,
    limit,
    remaining: Math.max(limit - existingEntry.count, 0),
    resetAt: existingEntry.resetAt,
    retryAfterMs: 0,
  };
}

export function getClientIpFromHeaders(headerStore: Headers) {
  const forwardedFor =
    headerStore.get("x-forwarded-for") ??
    headerStore.get("x-real-ip") ??
    headerStore.get("cf-connecting-ip") ??
    headerStore.get("x-vercel-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown-ip";
  }

  const forwarded = headerStore.get("forwarded");

  if (forwarded) {
    const match = forwarded.match(/for="?([^;,\s"]+)/i);

    if (match?.[1]) {
      return match[1];
    }
  }

  return "unknown-ip";
}

export function getClientFingerprint(headerStore: Headers) {
  const ip = getClientIpFromHeaders(headerStore);
  const userAgent = (headerStore.get("user-agent") ?? "unknown-agent").slice(0, 160);

  return `${ip}:${userAgent}`;
}

export function formatRetryAfter(retryAfterMs: number) {
  const totalSeconds = Math.max(Math.ceil(retryAfterMs / 1000), 1);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.ceil(totalSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours}h`;
}
