// server/trpc/init.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initTRPC, TRPCError } from '@trpc/server';
import {  Final } from '../actions/subscriptionService';
import { headers } from 'next/headers';
import superjson from "superjson";



export const createTRPCContext = async () => {
  const webHeaders = await headers();
  const  ip = webHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    webHeaders.get('x-real-ip') ??
    'unknown';
  const session = await auth.api.getSession({headers: webHeaders});
   const planResult = session?.user?.id
    ? await Final(session.user.id)
    : {  planTier: 'Free', 
      isActive: false, 
      daysLeft: null ,
      inOrganization: null
    };
  return { 
    session , 
    prisma , 
    headers: 
    webHeaders , 
    plan:planResult , 
    ip ,
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
