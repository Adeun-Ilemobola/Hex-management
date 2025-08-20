// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Works on Edge + Node. Put UPSTASH_REDIS_REST_URL/TOKEN in env.
export const redis = Redis.fromEnv();

export const globalLimiter = new Ratelimit({
  redis,
  // 60 requests per minute per user+procedure (sliding window)
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'trpc',
});

// You can define specialized limiters for heavy endpoints:
export const heavyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'trpc:heavy',
});
