
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

//Allow accessing the global object in TypeScript
const globalForRedis = global as unknown as { redis: Redis };

//Create the client (or use the existing one if it exists)
export const redis = globalForRedis.redis || new Redis(REDIS_URL);

//In development, save the instance to the global object
if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}