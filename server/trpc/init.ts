
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';



export const createTRPCContext = async (opts: { req: Request }) => {
  const session = await auth.api.getSession({
     headers: opts.req.headers,
  });


  return { session , prisma , req: opts.req };
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