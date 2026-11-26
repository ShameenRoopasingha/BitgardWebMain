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
