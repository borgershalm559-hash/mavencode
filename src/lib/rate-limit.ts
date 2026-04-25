import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// When Upstash env vars are absent (dev / CI) we fall through and allow
// everything. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in
// Vercel environment variables to activate distributed rate limiting.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function make(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`, prefix: string) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window), prefix });
}

const limiters = {
  // 5 failed logins per 15 min per identifier (email-based in auth.ts)
  auth:           make(5,  "15 m", "rl:auth"),
  // 10 registrations per hour per IP
  register:       make(10, "1 h",  "rl:register"),
  // 3 password-reset emails per hour per IP (prevent spam / user enumeration)
  forgotPassword: make(3,  "1 h",  "rl:forgot"),
  // 5 password changes per hour per IP
  changePassword: make(5,  "1 h",  "rl:changepw"),
};

export type LimiterKey = keyof typeof limiters;

/** Extract client IP from standard proxy headers, capped at 45 chars. */
export function getIp(req: Request): string {
  const fwd =
    (req.headers as Headers).get("x-forwarded-for") ??
    (req.headers as Headers).get("x-real-ip") ??
    "unknown";
  return fwd.split(",")[0]!.trim().slice(0, 45);
}

/**
 * Check a named rate-limit bucket for `identifier`.
 * Returns `{ ok: true }` when the request is allowed, or a 429 NextResponse
 * when the limit is exceeded.
 */
export async function rateLimit(
  key: LimiterKey,
  identifier: string,
): Promise<{ ok: true } | NextResponse> {
  const limiter = limiters[key];
  if (!limiter) return { ok: true }; // Upstash not configured — allow

  const { success, reset } = await limiter.limit(identifier);
  if (success) return { ok: true };

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Слишком много запросов. Попробуйте позже." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}
