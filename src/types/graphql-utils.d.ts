import * as Redis from "ioredis";

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: { redis: Redis.Redis, url: string }, info: any) => any
  }
}