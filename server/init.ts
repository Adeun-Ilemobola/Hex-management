// server/trpc/init.ts
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma'; 
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import superjson from "superjson";
import { DateTime } from 'luxon';
import { Metadata, MetadataT } from '@/lib/ZodObject';
import type { IncomingMessage, ServerResponse } from 'http';

type ContextInput = {
  req?: IncomingMessage;
  res?: ServerResponse;
};


export const createTRPCContext = async (opts?: ContextInput) => {
  let webHeaders: Headers;

  // ------------------------------------------------------------------
  // 1. DETERMINE SOURCE: Is this WebSocket (Node) or Next.js?
  // ------------------------------------------------------------------
  if (opts?.req && opts?.res) {
    // ✅ WEBSOCKET PATH (Standalone Node.js)
    // We must manually convert Node.js req.headers to a standard Web API Headers object
    // so BetterAuth can read it.
    webHeaders = new Headers();
    Object.entries(opts.req.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        webHeaders.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => webHeaders.append(key, v));
      }
    });
  } else {
    // ✅ NEXT.JS PATH (App Router)
    // This is safe to call only when running within Next.js
    webHeaders = await headers();
  }

  // ------------------------------------------------------------------
  // 2. AUTHENTICATION
  // ------------------------------------------------------------------
  const ip = webHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    webHeaders.get('x-real-ip') ??
    'unknown';

  // BetterAuth expects a Headers object, which we now have guaranteed
  const session = await auth.api.getSession({ headers: webHeaders });

  // ------------------------------------------------------------------
  // 3. METADATA LOGIC (Your existing code)
  // ------------------------------------------------------------------
  let sub: MetadataT = {
    daysLeft: 0,
    status: "",
    PlanTier: "Free",
    trialEnd: null,
    periodEnd: null,
    stripeCustomerId: session?.user?.stripeCustomerId ?? "",
    userId: session?.user?.id ?? "",
  };

  if (session && session.user) {
    const subscriptions = await auth.api.listActiveSubscriptions({
      query: { referenceId: session.user.id },
      headers: webHeaders,
    });

    const activeSubscription = subscriptions.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    if (activeSubscription) {
      const now = DateTime.local();
      const trialEndVal = activeSubscription.trialEnd
        ? DateTime.fromJSDate(activeSubscription.trialEnd)
        : now;
      const periodEndVal = activeSubscription.periodEnd
        ? DateTime.fromJSDate(activeSubscription.periodEnd)
        : now;

      const daysLeft = activeSubscription.status === "trialing"
        ? trialEndVal.diffNow("days").as("days")
        : periodEndVal.diffNow("days").as("days");

      const parsedSub = Metadata.safeParse({
        daysLeft: Math.max(0, Math.ceil(daysLeft)),
        status: activeSubscription.status,
        PlanTier: activeSubscription.plan,
        trialEnd: trialEndVal.isValid ? trialEndVal.toJSDate() : null,
        periodEnd: periodEndVal.isValid ? periodEndVal.toJSDate() : null,
      });

      if (parsedSub.success) {
        sub = parsedSub.data;
      } else {
        console.error("Failed to parse subscription metadata", parsedSub.error);
      }
    }
  }

  return {
    session,
    prisma,
    headers: webHeaders,
    subscription: sub,
    ip,
    _rateMeta: {} as { limit?: number; remaining?: number; reset?: number },
  };
};

// ... rest of the file

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.session.user } });
});
// Base router and procedure helpers
export const protectedProcedure = t.procedure.use(isAuthed);

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
