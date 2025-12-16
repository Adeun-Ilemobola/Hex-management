// src/lib/redis.ts

// 1. HTTP Client (Use this in ChatRouter.ts / Next.js API)
//    It is stateless and perfect for Serverless functions.
import { Redis as UpstashRedis } from '@upstash/redis';

export const redisHttp = new UpstashRedis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 2. TCP Client (Use this in redis-bridge.ts / WebSocket Server)
//    It keeps a live connection open, perfect for listening.
import Redis from 'ioredis';

export const redisSocket = new Redis(process.env.REDIS_URL!);