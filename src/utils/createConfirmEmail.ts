

import * as Redis from 'ioredis';
import { v4 } from 'uuid'
import { redisConfirmIDsPrefix } from './constants';

export const createConfirmEmailLink = async (url: string, userId: string, redis: Redis.Redis): Promise<string> => {
  const id = v4()

  await redis.set(redisConfirmIDsPrefix + id, userId, "ex", 60 * 60 * 24)

  return `${url}/confirm/${id}`
}