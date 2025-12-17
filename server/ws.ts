import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './app';
import { createTRPCContext } from './init'; 
import { setupRedisSubscriber } from './redis-bridge'; 
const wss = new WebSocketServer({ port: 3002 });
setupRedisSubscriber();

applyWSSHandler({
  wss,
  router: appRouter,
  createContext: async (opts) => {
    return await createTRPCContext({
     req: opts.req,
      res: opts.res,
    });
  },
});

console.log('✅ WebSocket running on ws://localhost:3002');
