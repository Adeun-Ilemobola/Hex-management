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

process.on('SIGTERM', () => {
  console.log('🛑 WS server shutting down');
  wss.close();
});

process.on('SIGINT', () => {
  console.log('🛑 WS server shutting down');
  wss.close();
});


console.log(`✅ WebSocket running on ${process.env.NEXT_PUBLIC_WS_URL}`);
