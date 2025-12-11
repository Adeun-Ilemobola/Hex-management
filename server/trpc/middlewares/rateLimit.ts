import { TRPCError } from '@trpc/server';
import {  heavy, light } from '@/lib/ratelimit';
import { t, type Context } from '../init'; // <- use your t + Context from init

// Reusable middleware factory
export function rateLimit(limiterType: "light" | "heavy" = "light") {
  return t.middleware(async ({ ctx, path, next }) => {
    // Prefer user id; fall back to IP; include path for per-procedure limiting
    const id = ctx.session?.user?.id ?? ctx.ip ?? 'anon';
    const key = `${id}:${path}`;
    let limiterCtx = light(ctx.session?.user?.id);
    if (limiterType === "heavy") {
      limiterCtx = heavy(ctx.session?.user?.id);
    }

    const { success, limit, remaining, reset ,...T } = await limiterCtx.limit(key);
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
// export const heavyRateLimit = () => rateLimit(heavyLimiter);
