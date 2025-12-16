import { createTRPCRouter } from "./init";
import { ChatRouter } from "./routers/Chat/ChatRouter";
import { ChatRoomRouter } from "./routers/ChatRoom";
import { organizationRouter } from "./routers/organization";
import { PropertiesRouter } from "./routers/Properties";
import { SubscriptionRouter } from "./routers/subscription";
import { userCongiRouter } from "./routers/userCongi";



export const appRouter = createTRPCRouter({
    Propertie: PropertiesRouter,
  user: userCongiRouter,
  organization:organizationRouter,
  // ChatRoom: ChatRoomRouter,
  subscription: SubscriptionRouter,
  Chat:ChatRouter

});

export type AppRouter = typeof appRouter;