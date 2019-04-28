import { Redis } from "ioredis";
import { removeAllUserSessions } from "./removeAllUserSessions";
import { User } from "../entity/User";

export const forgotPasswordLockAccount = async (userId: string, redis: Redis) => {
  User.update({ id: userId }, { forgotPasswordLock: true })
  await removeAllUserSessions(userId, redis)
}