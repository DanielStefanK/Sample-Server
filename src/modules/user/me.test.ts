import * as bcrypt from 'bcrypt'
import axios from 'axios'

import { User } from '../../entity/User';
import { Connection, BaseEntity, ObjectType } from 'typeorm';
import { createTypeormConn } from '../../utils/createTypeormConn';

let conn: Connection

const clearAll = async (entities: Array<ObjectType<BaseEntity>>): Promise<void> => {
  if (!conn || !conn.isConnected) {
    conn = await createTypeormConn()
  }

  try {
    for await (const entity of entities) {
      const repository = await conn.getRepository(entity);
      await repository.query(`DELETE FROM ${repository.metadata.tableName};`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}

const email = "email2@asdas.com"
const password = "test123"

const loginMutation = (e: string, p: string): string => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;


const meQuery = `
query {
  me {
    id
    email
  }
}
`;

const host: string = process.env.TEST_HOST || 'http://localhost:4004'

beforeEach(async (done) => {
  await clearAll([User])
  done()
})

afterAll(async (done) => {
  if (conn && conn.isConnected) {
    await conn.close()
  }
  done()
})


describe("me query", () => {

  test('with login', async (done) => {
    const pass = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: pass, confirmed: true }).save()

    await axios.post(host, { query: loginMutation(email, password) }, { withCredentials: true })


    const response2 = await axios.post(host, { query: meQuery }, { withCredentials: true })


    expect(response2.data.data).toEqual({
      me: {
        id: user.id,
        email: user.email
      }
    })

    done()
  });


  test('without login', async (done) => {
    const response2 = await axios.post(host, { query: meQuery }, { withCredentials: true })


    expect(response2.data.data).toEqual({
      me: null
    })

    done()
  });

})
