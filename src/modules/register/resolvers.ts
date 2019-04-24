import * as bcrypt from "bcrypt"
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const pass = await bcrypt.hash(password, 10)

      const user = User.create({
        email,
        password: pass
      })

      await user.save()
      return true
    }
  }
}