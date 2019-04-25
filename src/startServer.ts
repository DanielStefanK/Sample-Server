import * as dotenv from 'dotenv'
import * as Redis from 'ioredis'
import { GraphQLServer } from 'graphql-yoga'

import { User } from './entity/User';
import { createTypeormConn } from "./utils/createTypeormConn";
import { createSchema } from './utils/createSchema';

dotenv.config()
const port = process.env.NODE_ENV === "development" ? process.env.SERVER_PORT : process.env.TEST_SERVER_PORT

export const startServer = async () => {

  const redis = new Redis();

  const server = new GraphQLServer({
    schema: createSchema(),
    context: ({ request }) => ({ redis, url: request.protocol + "://" + request.get("host") })
  })

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
  const app = await server.start({ port, debug: true })
  console.log('Server is running on localhost:' + port)
  return app
}