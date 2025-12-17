// src/server/redis-bridge.ts
import superjson from "superjson";

import chatEvents from "./routers/Chat/chatEvent";
import { redisSocket } from "@/lib/redis";
import { MessageSchema } from "@/lib/ZodObject";

// 1. Create a TCP connection for listening
const subscriber = redisSocket;

export async function setupRedisSubscriber() {
  console.log("✅ Connecting to Redis Subscriber...");

  // 2. Subscribe to a global chat channel
  await subscriber.subscribe("chat-messages");

  // 3. When a message comes from Redis...
  subscriber.on("message", (channel, message) => {
    console.log("🔥 BRIDGE: Received message from Redis:", message); 
    try {
      if (channel === "chat-messages") {
         const revived = superjson.parse(message);
         const parsed = MessageSchema.parse(revived);
         console.log({
          revived,
          parsed

         });
         
        if (parsed.roomId) {
            chatEvents.emit(`message:${parsed.roomId}`, revived);
        }
      }
    } catch (err) {
      console.error("Redis message parse error", err);
    }
  });
}