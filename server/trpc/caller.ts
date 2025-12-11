import { createTRPCContext } from './init';
import { appRouter } from './routers/_app'; // your root router

export async function createServerCaller(custom?: { headers?: Headers }) {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
}

