type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const MAX_STORE_SIZE = 10_000;
const memoryStore = new Map<string, RateLimitEntry>();

function checkMemoryRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { limited: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    if (memoryStore.size >= MAX_STORE_SIZE) {
      for (const [k, v] of memoryStore.entries()) {
        if (now > v.resetTime) memoryStore.delete(k);
      }
      if (memoryStore.size >= MAX_STORE_SIZE) {
        const oldestKey = memoryStore.keys().next().value;
        if (oldestKey) memoryStore.delete(oldestKey);
      }
    }
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return { limited: false, remaining: maxAttempts - 1, retryAfterMs: 0 };
  }

  if (entry.count >= maxAttempts) {
    return { limited: true, remaining: 0, retryAfterMs: entry.resetTime - now };
  }

  entry.count += 1;
  return { limited: false, remaining: maxAttempts - entry.count, retryAfterMs: 0 };
}

/**
 * Shared rate limiter using Upstash Redis REST when UPSTASH_REDIS_REST_URL &
 * UPSTASH_REDIS_REST_TOKEN are set, falling back to an in-memory bounded map otherwise.
 */
export async function checkDistributedRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number = 15 * 60 * 1000
): Promise<{ limited: boolean; remaining: number; retryAfterMs: number }> {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!restUrl || !restToken) {
    // Distributed PostgreSQL atomic rate-limit fallback for serverless instances without Redis
    if (process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
      try {
        const { prisma } = await import("./index");
        const nowMs = Date.now();
        const nextReset = new Date(nowMs + windowMs);
        const rows = await prisma.$queryRaw<Array<{ count: number; reset_at: Date }>>`
          INSERT INTO "rate_limit_buckets" ("key", "count", "resetAt")
          VALUES (${key}, 1, ${nextReset})
          ON CONFLICT ("key") DO UPDATE SET
            "count" = CASE WHEN "rate_limit_buckets"."resetAt" <= NOW() THEN 1 ELSE "rate_limit_buckets"."count" + 1 END,
            "resetAt" = CASE WHEN "rate_limit_buckets"."resetAt" <= NOW() THEN ${nextReset} ELSE "rate_limit_buckets"."resetAt" END
          RETURNING "count", "resetAt" AS "reset_at"
        `;
        if (Array.isArray(rows) && rows.length > 0 && typeof rows[0]?.count === "number") {
          const count = Number(rows[0].count);
          const resetAtMs = new Date(rows[0].reset_at).getTime();
          if (count > maxAttempts) {
            return {
              limited: true,
              remaining: 0,
              retryAfterMs: Math.max(0, resetAtMs - nowMs),
            };
          }
          return {
            limited: false,
            remaining: Math.max(0, maxAttempts - count),
            retryAfterMs: 0,
          };
        }
      } catch {
        // Fall back safely to bounded in-memory limiter
      }
    }

    return checkMemoryRateLimit(key, maxAttempts, windowMs);
  }

  try {
    const redisKey = `bg_rl:${key}`;
    const res = await fetch(`${restUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${restToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["PTTL", redisKey],
      ]),
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) {
      return checkMemoryRateLimit(key, maxAttempts, windowMs);
    }

    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data?.[0]?.result ?? 0);
    let ttlMs = Number(data?.[1]?.result ?? -1);

    if (count === 1 || ttlMs < 0) {
      await fetch(`${restUrl}/pexpire/${encodeURIComponent(redisKey)}/${windowMs}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${restToken}` },
        signal: AbortSignal.timeout(2500),
      }).catch(() => {});
      ttlMs = windowMs;
    }

    if (count > maxAttempts) {
      return {
        limited: true,
        remaining: 0,
        retryAfterMs: ttlMs > 0 ? ttlMs : windowMs,
      };
    }

    return {
      limited: false,
      remaining: Math.max(0, maxAttempts - count),
      retryAfterMs: 0,
    };
  } catch {
    return checkMemoryRateLimit(key, maxAttempts, windowMs);
  }
}

export async function consumeBitgardReplayNonce(
  nonceKey: string,
  windowMs: number = 6 * 60 * 1000
): Promise<boolean> {
  const res = await checkDistributedRateLimit(`replay:${nonceKey}`, 1, windowMs);
  return !res.limited;
}
