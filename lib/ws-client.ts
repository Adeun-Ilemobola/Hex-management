// src/lib/ws-client.ts
import { createWSClient } from '@trpc/client';

export const wsClient = typeof window !== 'undefined' ? createWSClient({
        url: process.env.NEXT_PUBLIC_WS_URL!,
      }): null;
