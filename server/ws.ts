import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './app';
import { createTRPCContext } from './init'; 
import { setupRedisSubscriber } from './redis-bridge'; 
const wss = new WebSocketServer({ port: 3001 });
setupRedisSubscriber();

applyWSSHandler({
  wss,
  router: appRouter,
  createContext: async () => {
    return await createTRPCContext();
  },
});

console.log('✅ WebSocket running on ws://localhost:3001');
