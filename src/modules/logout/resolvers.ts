import { ResolverMap } from "../../types/graphql-utils";
import { redisSessionUserIdPrefix, redisSessionPrefix } from "../../utils/constants";

export const resolvers: ResolverMap = {
  Query: {
    bye3: () => 'hi'
  },
  Mutation: {
    logout: async (_, __, { session }) => {

      const out = await new Promise((res) => {
        session.destroy((err) => {
          if (err) {
            console.log(err)
            res(false)
            return
          }
          res(true)
        })
      })

      if (out) {
        return null
      }

      return [{ path: "server", message: "server could not log you out" }]
    },

    logoutAll: async (_, __, { session, redis }) => {
      const { userId } = session
      if (userId) {
        const sessionIds = await redis.lrange(redisSessionUserIdPrefix + userId, 0, -1)
        const rPipeline = redis.multi();

        sessionIds.forEach((key: string) => {
          rPipeline.del(`${redisSessionPrefix}${key}`);
        });

        await rPipeline.exec(err => {
          if (err) {
            console.log(err);
          }
        })

        return null
      }
      else {
        return [{ path: "authentication", message: "you are not logged in" }]
      }
    }
  }
}