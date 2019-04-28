import * as Redis from 'ioredis';
import { v4 } from 'uuid'
import { redisPasswordResetPrefix, passwordResetLinkExpiration } from './constants';

export const createForgotPasswordEmail = async (url: string, userId: string, redis: Redis.Redis): Promise<string> => {
  const id = v4()

  await redis.set(redisPasswordResetPrefix + id, userId, "ex", passwordResetLinkExpiration)

  return `${url}/recover-password/${id}`
}