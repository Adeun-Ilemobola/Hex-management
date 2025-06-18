import { z } from 'zod';

import { protectedProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './UserRouter';
export const appRouter = createTRPCRouter({

  Propertie:PropertiesRouter,

  // Add other routers here as needed
  testM:protectedProcedure
  .input( z.object({name: z.string().min(1, "Name is required") }))
  .mutation(async ({ ctx , input }) => {
    return {
      message: 'Hello from the test mutation! NAME HERE' + input.name,
      user: ctx.user,
    };
  })

  
});
// export type definition of API
export type AppRouter = typeof appRouter;