// src/server/redis-bridge.ts
import Redis from "ioredis";
import chatEvents from "./routers/Chat/chatEvent";
import { redisSocket } from "@/lib/redis";
// 1. Create a TCP connection for listening
const subscriber = redisSocket;

export async function setupRedisSubscriber() {
  console.log("✅ Connecting to Redis Subscriber...");

  // 2. Subscribe to a global chat channel
  await subscriber.subscribe("chat-messages");

  // 3. When a message comes from Redis...
  subscriber.on("message", (channel, message) => {
    try {
      if (channel === "chat-messages") {
        const parsedMessage = JSON.parse(message);
        
        // ...forward it to your local internal event emitter!
        // This bridges the gap between the separate processes.
        if (parsedMessage.roomId) {
            chatEvents.emit(`message:${parsedMessage.roomId}`, parsedMessage);
        }
      }
    } catch (err) {
      console.error("Redis message parse error", err);
    }
  });
}