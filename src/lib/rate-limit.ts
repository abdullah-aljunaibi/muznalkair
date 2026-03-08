type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterMs: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __muznRateLimitStore?: Map<string, Entry>;
};

const store = globalStore.__muznRateLimitStore ?? new Map<string, Entry>();
globalStore.__muznRateLimitStore = store;

function now() {
  return Date.now();
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const ts = now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= ts) {
    store.set(key, { count: 1, resetAt: ts + config.windowMs });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      retryAfterMs: 0,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - ts,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    retryAfterMs: 0,
  };
}

export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 7 },
  register: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  forgotPassword: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  resetPassword: { windowMs: 15 * 60 * 1000, maxRequests: 8 },
} as const;
