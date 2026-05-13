import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

let redis: Redis | null | undefined;

function redisClient(): Redis | null {
  if (redis === undefined) redis = createRedis();
  return redis;
}

function slidingLimiter(name: string, max: number, window: "1 m" | "1 h") {
  const r = redisClient();
  if (!r) return null;
  return new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `CredexAudit:${name}`,
    analytics: false,
  });
}

let summaryLimiter: Ratelimit | null | undefined;
let saveLimiter: Ratelimit | null | undefined;
let leadsLimiter: Ratelimit | null | undefined;
let auditGetLimiter: Ratelimit | null | undefined;

export function getSummaryRateLimiter(): Ratelimit | null {
  if (summaryLimiter === undefined) summaryLimiter = slidingLimiter("summary", 25, "1 m");
  return summaryLimiter;
}

export function getSaveRateLimiter(): Ratelimit | null {
  if (saveLimiter === undefined) saveLimiter = slidingLimiter("save", 20, "1 m");
  return saveLimiter;
}

export function getLeadsRateLimiter(): Ratelimit | null {
  if (leadsLimiter === undefined) leadsLimiter = slidingLimiter("leads", 12, "1 m");
  return leadsLimiter;
}

export function getAuditGetRateLimiter(): Ratelimit | null {
  if (auditGetLimiter === undefined) auditGetLimiter = slidingLimiter("audit-get", 60, "1 m");
  return auditGetLimiter;
}

export function getClientIp(request: NextRequest): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function rateLimitOr429(
  request: NextRequest,
  limiter: Ratelimit | null,
  bucketKey: string
): Promise<NextResponse | null> {
  if (!limiter) return null;
  const ip = getClientIp(request);
  const { success, reset } = await limiter.limit(`${bucketKey}:${ip}`);
  if (success) return null;
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Try again in a moment.", retryAfter },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}
