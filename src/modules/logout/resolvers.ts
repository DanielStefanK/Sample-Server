import { ResolverMap } from '../../types/graphql-utils';
import { removeAllUserSessions } from '../../utils/removeAllUserSessions';

export const resolvers: ResolverMap = {
  Query: {
    bye3: () => 'hi',
  },
  Mutation: {
    logout: async (_, __, { session }) => {
      const out = await new Promise(res => {
        session.destroy(err => {
          if (err) {
            console.log(err);
            res(false);
            return;
          }
          res(true);
        });
      });

      if (out) {
        return null;
      }

      return [{ path: 'server', message: 'server could not log you out' }];
    },

    logoutAll: async (_, __, { session, redis }) => {
      const { userId } = session;
      if (userId) {
        removeAllUserSessions(userId, redis);
        return null;
      } else {
        return [{ path: 'authentication', message: 'you are not logged in' }];
      }
    },
  },
};
