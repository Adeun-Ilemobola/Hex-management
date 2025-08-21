import { TRPCError } from '@trpc/server';
import { globalLimiter, heavyLimiter } from '@/lib/ratelimit';
import { t, type Context } from '../init'; // <- use your t + Context from init

// Reusable middleware factory
export function rateLimit(limiter = globalLimiter) {
  return t.middleware(async ({ ctx, path, next }) => {
    // Prefer user id; fall back to IP; include path for per-procedure limiting
    const id = ctx.session?.user?.id ?? ctx.ip ?? 'anon';
    const key = `${id}:${path}`;

    const { success, limit, remaining, reset ,...T } = await limiter.limit(key);
    console.log({
      success,
      limit,
      remaining,
      reset,
      T,
      key,
      id,
      path
    });
    

    // expose for adapter to emit headers
    ctx._rateMeta = { limit, remaining, reset };

    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Try again soon.',
      });
    }
    return next();
  });
}

// Optional: export a stricter version for heavy endpoints
export const heavyRateLimit = () => rateLimit(heavyLimiter);
