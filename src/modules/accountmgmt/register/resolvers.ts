import * as bcrypt from 'bcrypt';
import * as yup from 'yup';

import { ResolverMap } from '../../../types/graphql-utils';
import { User } from '../../../entity/User';
import { formatYupError } from '../../../utils/formatYupError';
import { createConfirmEmailLink } from '../../../utils/createConfirmEmail';
import { sendEmail } from '../../../utils/sendEmail';
import { passwordModel } from '../../../utils/validityModels';

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email()
    .required(),
  password: passwordModel,
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'hi',
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url },
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      });
      if (userAlreadyExists) {
        // TODO: revise for i18n error handling in frontend
        return [
          {
            path: 'email',
            message: 'already taken',
          },
        ];
      }

      const pass = await bcrypt.hash(password, 10);

      const user = User.create({
        email,
        password: pass,
      });

      await user.save();

      const link = await createConfirmEmailLink(url, user.id, redis);

      sendEmail(user.email, link);

      return null;
    },
  },
};
