// src/lib/client.tsx
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
import { useEffect, useState } from 'react';
import type { AppRouter } from '@/server/app';

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [wsClient] = useState(() => createWSClient({
    url: 'ws://localhost:3002',
  }));

  // useEffect(() => {
  //   return () => {
  //     console.log("Cleaning up WebSocket client");
  //     wsClient.close();
  //   };
  // }, [wsClient]);

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },

          // 🔵 WebSocket link
          true: wsLink<AppRouter>({
            client: wsClient,
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
