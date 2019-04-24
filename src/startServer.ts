import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { createTypeormConn } from "./utils/createTypeormConn";
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { mergeSchemas, makeExecutableSchema } from "graphql-tools"
import { GraphQLSchema } from 'graphql';

dotenv.config()
const port = process.env.NODE_ENV === "development" ? process.env.SERVER_PORT : process.env.TEST_SERVER_PORT

export const startServer = async () => {
  const schemas: GraphQLSchema[] = []
  const folders = fs.readdirSync(path.join(__dirname, "./modules"))
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`)
    const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`))
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })

  const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) })
  await createTypeormConn()
  const app = await server.start({ port, debug: true })
  console.log('Server is running on localhost:' + port)
  return app
}