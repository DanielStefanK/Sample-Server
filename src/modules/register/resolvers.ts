import * as bcrypt from "bcrypt"
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'hi'
  },
  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const userAlreadyExists = await User.findOne({ where: { email }, select: ['id'] })

      if (userAlreadyExists) {
        // TODO: revise for i18n error handling in frontend
        return [
          {
            path: "email",
            message: "already taken"
          }
        ]
      }

      const pass = await bcrypt.hash(password, 10)

      const user = User.create({
        email,
        password: pass
      })

      await user.save()
      return null
    }
  }
}