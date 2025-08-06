import { headers as nextHeaders } from 'next/headers';
import { createTRPCContext } from './init';
import { appRouter } from './routers/_app'; // your root router

export async function createServerCaller(custom?: { headers?: Headers }) {
  const hdrs = custom?.headers ?? (await nextHeaders()); // works in RSC/actions
  const ctx = await createTRPCContext({ headers: hdrs as unknown as Headers });
  return appRouter.createCaller(ctx);
}
