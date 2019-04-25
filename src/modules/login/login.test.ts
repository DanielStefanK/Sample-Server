import * as bcrypt from 'bcrypt'
import { request } from 'graphql-request'

import { User } from '../../entity/User';
import { Connection, BaseEntity, ObjectType } from 'typeorm';
import { createTypeormConn } from '../../utils/createTypeormConn';

let conn: Connection

const clearAll = async (entities: Array<ObjectType<BaseEntity>>) => {
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
const emailN = "noReg2@asdsa.com"
const passwordN = "123"


const loginMutation = (e: string, p: string): string => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;


const host: string = process.env.TEST_HOST || 'http://localhost:4004'

beforeEach(async (done) => {
  await clearAll([User])
  done()
})

describe("Login module", () => {

  test('login valid', async (done) => {
    const pass = await bcrypt.hash(password, 10)
    await User.create({ email, password: pass, confirmed: true }).save()

    const response = await request(host, loginMutation(email, password))
    expect(response).toEqual({ login: null })

    done()
  });


  test('login unconfirmed', async (done) => {
    const pass = await bcrypt.hash(password, 10)
    await User.create({ email, password: pass, confirmed: false }).save()

    const response = await request(host, loginMutation(email, password))
    expect(response).toEqual({
      login: [{
        path: "login",
        message: "please confirm your email"
      }]
    })

    done()
  });


  test('login invalid email', async (done) => {
    const pass = await bcrypt.hash(password, 10)
    await User.create({ email, password: pass, confirmed: true }).save()

    const response = await request(host, loginMutation(emailN, password))
    expect(response).toEqual({
      login: [{
        path: "login",
        message: "invalid credentials"
      }]
    })

    done()
  });

  test('login invalid pass', async (done) => {
    const pass = await bcrypt.hash(password, 10)
    await User.create({ email, password: pass, confirmed: true }).save()

    const response = await request(host, loginMutation(email, passwordN))
    expect(response).toEqual({
      login: [{
        path: "login",
        message: "invalid credentials"
      }]
    })

    done()
  });

})
