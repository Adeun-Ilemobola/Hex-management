
import { baseProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './UserRouter';
export const appRouter = createTRPCRouter({

  Propertie:PropertiesRouter,

  
});
// export type definition of API
export type AppRouter = typeof appRouter;