// server/trpc/init.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initTRPC, TRPCError } from '@trpc/server';
import { fetchUserPlan } from '../actions/subscriptionService';
import { headers } from 'next/headers';


export const createTRPCContext = async () => {
  const webHeaders = await headers();
  const session = await auth.api.getSession({headers: webHeaders});
   const planResult = session?.user?.id
    ? await fetchUserPlan(session.user.id)
    : { success: false, data: { planTier: 'Free', isActive: false, daysLeft: null } };
  return { session , prisma , headers: webHeaders , plan:planResult};
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();
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
