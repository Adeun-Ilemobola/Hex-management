import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/routers/_app';
import { createTRPCContext } from '@/server/trpc/init';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    
  });

export { handler as GET, handler as POST };

// trpc/[trpc]/route.ts




// // app/api/trpc/[trpc]/route.ts
// import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
// import { appRouter } from '@/server/trpc/routers/_app';
// import { createTRPCContext } from '@/server/trpc/init';

// export const runtime = 'edge'; // or 'nodejs'

// const handler = (req: Request) =>
//   fetchRequestHandler({
//     endpoint: '/api/trpc',
//     req,
//     router: appRouter,
//    createContext: () => createTRPCContext(), // no opts
//     responseMeta({ ctx, errors }) {
//       const headers = new Headers();
//       const meta = ctx?._rateMeta;
//       if (meta?.limit != null) {
//         headers.set('X-RateLimit-Limit', String(meta.limit));
//         headers.set('X-RateLimit-Remaining', String(meta.remaining ?? 0));
//         headers.set('X-RateLimit-Reset', String(meta.reset ?? 0));
//       }
//       if (errors.length && errors[0].code === 'TOO_MANY_REQUESTS') {
//         return { status: 429, headers };
//       }
//       return { headers };
//     },
//   });

// export { handler as GET, handler as POST };

