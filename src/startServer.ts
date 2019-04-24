import { GraphQLServer } from 'graphql-yoga'

import { resolvers } from './resolvers'
import { createTypeormConn } from "./utils/createTypeormConn";
import * as dotenv from 'dotenv'
console.log(process.env.NODE_ENV);

dotenv.config()
const port = process.env.NODE_ENV === "development" ? process.env.SERVER_PORT : process.env.TEST_SERVER_PORT
export const startServer = async () => {
  const server = new GraphQLServer({ typeDefs: 'src/schema.graphql', resolvers })
  await createTypeormConn()
  const app = await server.start({ port, debug: true })
  console.log('Server is running on localhost:' + port)
  return app
}