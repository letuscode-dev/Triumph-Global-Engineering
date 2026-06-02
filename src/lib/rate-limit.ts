// Sliding/fixed-window rate limiter.
//
// - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Upstash
//   Redis over REST (works across multiple serverless instances).
// - Otherwise falls back to an in-memory map (fine for a single instance/demo).

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
};

export type RateLimitOptions = {
  /** When Upstash is unavailable, block instead of falling back to in-memory. */
  failClosed?: boolean;
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const upstashEnabled = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const g = globalThis as unknown as { __tgeHits?: Map<string, number[]> };
function store() {
  if (!g.__tgeHits) g.__tgeHits = new Map();
  return g.__tgeHits;
}

function inMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const hits = (store().get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const retryAfterMs = windowMs - (now - hits[0]);
    store().set(key, hits);
    return { ok: false, remaining: 0, retryAfterMs };
  }
  hits.push(now);
  store().set(key, hits);
  return { ok: true, remaining: limit - hits.length, retryAfterMs: 0 };
}

function blocked(windowMs: number): RateLimitResult {
  return { ok: false, remaining: 0, retryAfterMs: windowMs };
}

// Upstash fixed-window counter: INCR then EXPIRE on first hit.
async function upstash(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}`;
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, String(windowSec), "NX"],
      ["PTTL", redisKey],
    ]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash error ${res.status}`);
  const data = (await res.json()) as Array<{ result: number }>;
  const count = Number(data[0]?.result ?? 0);
  const pttl = Number(data[2]?.result ?? windowMs);
  const retryAfterMs = pttl > 0 ? pttl : windowMs;
  if (count > limit) {
    return { ok: false, remaining: 0, retryAfterMs };
  }
  return { ok: true, remaining: Math.max(0, limit - count), retryAfterMs: 0 };
}

export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  if (upstashEnabled) {
    try {
      return await upstash(key, limit, windowMs);
    } catch {
      if (options?.failClosed) return blocked(windowMs);
      return inMemory(key, limit, windowMs);
    }
  }
  return inMemory(key, limit, windowMs);
}
