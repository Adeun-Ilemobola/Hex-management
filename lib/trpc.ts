// import { createTRPCContext } from '@trpc/tanstack-react-query';
// import type { AppRouter } from '@/server/trpc/routers/_app';
//  
// export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();


import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers/_app';

export const api = createTRPCReact<AppRouter>();
