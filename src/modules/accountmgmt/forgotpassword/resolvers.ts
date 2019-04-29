import * as bcrypt from 'bcrypt';
import * as yup from 'yup';

import { ResolverMap } from '../../../types/graphql-utils';
import { User } from '../../../entity/User';
import { redisPasswordResetPrefix } from '../../../utils/constants';
import { passwordModel } from '../../../utils/validityModels';
import { formatYupError } from '../../../utils/formatYupError';
import { forgotPasswordLockAccount } from '../../../utils/forgotPasswordLockAccount';
import { createForgotPasswordEmail } from '../../../utils/createForgotPasswordEmail';

const schema = yup.object().shape({
  newPassword: passwordModel,
});

export const resolvers: ResolverMap = {
  Query: {
    bye4: () => 'hi',
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis, url },
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      await forgotPasswordLockAccount(user.id, redis);
      const link = await createForgotPasswordEmail(url, user.id, redis);
      // TODO: send email
      console.log(link);
      return null;
    },

    changePasswordWithToken: async (
      _,
      { newPassword, token }: GQL.IChangePasswordWithTokenOnMutationArguments,
      { redis },
    ) => {
      const userId = await redis.get(`${redisPasswordResetPrefix}${token}`);

      if (!userId) {
        return [
          {
            path: 'authentication',
            message: 'invalid token',
          },
        ];
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const pass = await bcrypt.hash(newPassword, 10);
      const update = User.update(
        { id: userId },
        { password: pass, forgotPasswordLock: false },
      );
      const del = redis.del(`${redisPasswordResetPrefix}${token}`);

      await Promise.all([update, del]);

      return null;
    },
  },
};
