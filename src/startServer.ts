import * as dotenv from 'dotenv'
import * as Redis from 'ioredis'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import { GraphQLServer } from 'graphql-yoga'

import { User } from './entity/User';
import { createTypeormConn } from "./utils/createTypeormConn";
import { createSchema } from './utils/createSchema';

dotenv.config()

const SESSION_SECRET = process.env.SESSION_SECRET || 'test'
const port = process.env.NODE_ENV === "development" ? process.env.SERVER_PORT : process.env.TEST_SERVER_PORT
const RedisStore = connectRedis(session)

export const startServer = async () => {

  const redis = new Redis();

  const server = new GraphQLServer({
    schema: createSchema(),
    context: ({ request }) => ({ redis, url: request.protocol + "://" + request.get("host"), session: request.session })
  })


  server.express.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );


  const cors = {
    credentials: true,
    origin: process.env.FRONT_END_ORIGIN || "http://localhost:3000"
  };

  // TODO: use a graphql endpoint to confirm
  server.express.get('/confirm/:id', async (req, res) => {
    const { id } = req.params
    const userId = await redis.get(id)

    if (userId) {
      await User.update({ id: userId }, { confirmed: true })
      redis.del(id)
      res.send('ok')
      return
    }

    res.status(404).send('Not found')
  })

  await createTypeormConn()
  const app = await server.start({ port, debug: true, cors })
  console.log('Server is running on localhost:' + port)
  return app
}