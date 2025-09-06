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



});
// export type definition of API
export type AppRouter = typeof appRouter;