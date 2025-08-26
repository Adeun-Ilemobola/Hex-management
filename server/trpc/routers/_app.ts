import { z } from 'zod';
import { DateTime } from "luxon";

import { protectedProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './Properties';
import { stripe } from '@/lib/stripe';
import { TRPCError } from "@trpc/server";
import { userCongiRouter } from './userCongi';
import { createServerCaller } from '../caller';
import { organizationRouter } from './organization';
import { ChatRoomRouter } from './ChatRoom';
import { SubscriptionRouter } from './subscription';
//import { headers } from "next/headers";

export const appRouter = createTRPCRouter({

  Propertie: PropertiesRouter,
  user: userCongiRouter,
  organization:organizationRouter,
  ChatRoom: ChatRoomRouter,
  subscription: SubscriptionRouter,

  // Add other routers here as needed

    test: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.session?.user;
      if (!user) {
        console.warn("[test] not signed in");
        // you can either throw or return a shaped error
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
      }
       const trpc = await createServerCaller();
       await trpc.user.getUserPlan()
      return { ok: true };
    }),


});
// export type definition of API
export type AppRouter = typeof appRouter;