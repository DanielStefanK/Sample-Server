import * as bcrypt from "bcrypt"

import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";




export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'hi'
  },
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments, { session }) => {

      const user = await User.findOne({ where: { email } })

      if (!user) {
        return [{
          path: "login",
          message: "invalid credentials"
        }]
      }

      if (!user.confirmed) {
        return [{
          path: "login",
          message: "please confirm your email"
        }]
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        return [{
          path: "login",
          message: "invalid credentials"
        }]
      }

      session.userId = user.id
      return null
    }
  }
}