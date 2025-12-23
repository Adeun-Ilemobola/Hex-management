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
import { wsClient } from './ws-client';

export const trpc = createTRPCReact<AppRouter>();


export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  function SetupWebSocket() {
    if (wsClient) {
      return wsLink({
        client: wsClient,
        transformer: superjson,
      })
    }
    return httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL!}/api/trpc`,
      transformer: superjson,
    });

  }

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },

          // 🔵 WebSocket link
          true: SetupWebSocket(),
          // 🟢 HTTP link
          false: httpBatchLink({
            url: `${process.env.NEXT_PUBLIC_APP_URL!}/api/trpc`,
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
