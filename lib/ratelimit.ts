// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Works on Edge + Node. Put UPSTASH_REDIS_REST_URL/TOKEN in env.
export const redis = Redis.fromEnv();

// export const globalLimiter = new Ratelimit({
//   redis,
//   // 30 requests per minute per user+procedure (sliding window)
//   limiter: Ratelimit.slidingWindow(30,'1 m' ),
//   analytics: true,
//   prefix: 'trpc',
// });

 export function light(user: string | undefined) {
  const  time = user ? '1 m' : '120 s'
  const  limit = user ? 70 : 30

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, time),
    analytics: true,
    prefix: 'trpc:light',
  });
  
}

export function heavy(user: string | undefined) {
   const  time = user ? '1 m' : '160 s'
  const  limit = user ? 12 : 5
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, time),
    analytics: true,
    prefix: 'trpc:heavy',
  });
}

// You can define specialized limiters for heavy endpoints:
// export const heavyLimiter = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(10, '1 m'),
//   analytics: true,
//   prefix: 'trpc:heavy',
// });
