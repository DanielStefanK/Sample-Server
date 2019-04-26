import { ResolverMap } from "../../types/graphql-utils";

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
    }
  }
}