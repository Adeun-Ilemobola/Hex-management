'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  httpBatchLink,
  splitLink,
  wsLink,
  createWSClient,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { useState } from 'react';
import type { AppRouter } from '@/server/app';

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [wsClient] = useState(() =>
    typeof window !== 'undefined'
      ? createWSClient({
          url: process.env.NEXT_PUBLIC_WS_URL!, // ws://localhost:3001
        })
      : null
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },

          // 🔵 WebSocket link
          true: wsLink({
            client: wsClient!,
            transformer: superjson,
          }),

          // 🟢 HTTP link
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: superjson,
          }),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
