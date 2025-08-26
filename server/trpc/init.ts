// server/trpc/init.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import superjson from "superjson";
import { DateTime } from 'luxon';
import { limitMeta, subMeta } from '@/lib/Zod';



type userOrgMembersPayload = {
  ownerOrganizationIds: string[];
  isUserAEployeeOfOrg: {
    organizationId: string;
    isEployee: boolean;
  };
}


export const createTRPCContext = async () => {
  const webHeaders = await headers();
  let sub: subMeta | null = null
  let userOrgMembership: userOrgMembersPayload = {
    ownerOrganizationIds: [],
    isUserAEployeeOfOrg: {
      organizationId: "",
      isEployee: false
    }
  }
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
      const trialEnd = DateTime.fromJSDate(activeSubscription.trialEnd || DateTime.local().toJSDate()).diff(DateTime.local()).days
      const periodEnd = DateTime.fromJSDate(activeSubscription.periodEnd || DateTime.local().toJSDate()).diff(DateTime.local()).days

      sub = {
        ...activeSubscription,
        daysLeft: activeSubscription.status === "trialing" ? trialEnd : periodEnd,
        limits: activeSubscription.limits as limitMeta
      }

    }
    const memberships = await prisma.member.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true, role: true },
    });
    const isUserAEployeeOfOrg = memberships.some(m => m.role === "member") ;
    userOrgMembership = {
      ownerOrganizationIds: memberships
        .filter(m => m.role === "owner")
        .map(m => m.organizationId),
        isUserAEployeeOfOrg: {
          organizationId: isUserAEployeeOfOrg ? memberships[0].organizationId : "",
          isEployee: isUserAEployeeOfOrg
        }
      
    };
  }

  return {
    session,
    prisma,
    headers:
      webHeaders,
    subscription: sub,
    userOrgMembership,

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
