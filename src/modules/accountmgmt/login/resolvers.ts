import * as bcrypt from 'bcrypt';

import { ResolverMap } from '../../../types/graphql-utils';
import { User } from '../../../entity/User';
import { redisSessionUserIdPrefix } from '../../../utils/constants';

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'hi',
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session, redis, request },
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return [
          {
            path: 'login',
            message: 'invalid credentials',
          },
        ];
      }

      if (!user.confirmed) {
        return [
          {
            path: 'login',
            message: 'please confirm your email',
          },
        ];
      }

      if (user.forgotPasswordLock) {
        return [
          {
            path: 'login',
            message: 'please recover your password',
          },
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return [
          {
            path: 'login',
            message: 'invalid credentials',
          },
        ];
      }

      session.userId = user.id;

      if (request.sessionID) {
        await redis.lpush(
          redisSessionUserIdPrefix + user.id,
          request.sessionID,
        );
      }

      return null;
    },
  },
};
