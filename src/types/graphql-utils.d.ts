import * as Redis from "ioredis";
import { Request } from "express";

export interface Session extends Express.Session {
  userId?: string,
}

export type Resolver = (parent: any, args: any, context: { redis: Redis.Redis, url: string, session: Session }, info: any) => any

export type Middleware = (resolver: Resolver, parent: any, args: any, context: { redis: Redis.Redis, url: string, session: Session }, info: any) => any

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver
  }
}