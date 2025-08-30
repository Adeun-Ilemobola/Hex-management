// server/trpc/init.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import superjson from "superjson";
import { DateTime } from 'luxon';
import { limitMeta, Metadata, MetadataT, subMeta } from '@/lib/Zod';



type userOrgMembersPayload = {
  ownerOrganizationIds: string[];
  isUserAEployeeOfOrg: {
    organizationId: string;
    isEployee: boolean;
  };
}


export const createTRPCContext = async () => {
  const webHeaders = await headers();
  let sub: MetadataT | null = null

  const ip = webHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    webHeaders.get('x-real-ip') ??
    'unknown';
  const session = await auth.api.getSession({ headers: webHeaders });

  if (session && session.user) {
    const subscriptions = await auth.api.listActiveSubscriptions({
      query: {
        referenceId: session.user.id,
      },
      // This endpoint requires session cookies.
      headers: webHeaders,
    });
    // get the active subscription
    const activeSubscription = subscriptions.find(
      sub => sub.status === "active" || sub.status === "trialing"
    );
    if (activeSubscription) {
      const trialEnd = DateTime.fromISO(DateTime.fromJSDate(activeSubscription.trialEnd || new Date()  ).toISO() || DateTime.local().toISO()).diffNow("days").as("days")
      const periodEnd = DateTime.fromISO(DateTime.fromJSDate(activeSubscription.periodEnd || new Date() ).toISO() || DateTime.local().toISO()).diffNow("days").as('days')
      const daysLeft = activeSubscription.status === "trialing" ? trialEnd : periodEnd

      const vSub = Metadata.parse({
        ...activeSubscription,
         daysLeft: Math.max(0, Math.ceil(daysLeft)),
         limits: activeSubscription.limits 
         
      
      })

      sub = {
        ...vSub,
      }

    }

  }

  return {
    session,
    prisma,
    headers:
      webHeaders,
    subscription: sub,

    ip,
    _rateMeta: {} as { limit?: number; remaining?: number; reset?: number },
  };
};

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
