import { request } from 'graphql-request'
import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { getConnection } from 'typeorm';

const email = "email@asdas.com"
const password = "test123"

const faultyEmail = "e"
const faultyPass = "1"

const mutation = (e: string, p: string): string => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const host: string = process.env.TEST_HOST || 'http://localhost:4004'

beforeEach(async (done) => {
  try {
    await createTypeormConn()
  } catch (err) {
    // already have a connection
  }
  done()
})

afterEach(async (done) => {
  const conn = getConnection()
  await conn.close()
  done()
})

describe("Register module", () => {

  test('Register User', async (done) => {
    const response = await request(host, mutation(email, password))
    expect(response).toEqual({ register: null })
    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)

    const user = users[0]

    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)
    done()
  });

  test('Register Duplicate fails', async (done) => {
    const response = await request(host, mutation(email, password))
    expect(response).toEqual({ register: null })

    const regAgain: any = await request(host, mutation(email, password))
    expect(regAgain.register).toHaveLength(1)

    expect(regAgain.register[0].path).toEqual("email")
    const usersAgain = await User.find({ where: { email } })
    expect(usersAgain).toHaveLength(1)
    done()
  })

  test('Invalid Register Input', async () => {
    const response: any = await request(host, mutation(faultyEmail, faultyPass))
    expect(response.register).toHaveLength(3)

    const users = await User.find()
    expect(users).toHaveLength(0)
  })

  test('Invalid Email Register', async () => {
    const response: any = await request(host, mutation("asdasdasdasd", password))
    expect(response.register).toHaveLength(1)
    expect(response.register[0].path).toEqual("email")

    const users = await User.find()
    expect(users).toHaveLength(0)
  })

  test('Invalid Password Register', async () => {
    const response: any = await request(host, mutation(email, faultyPass))
    expect(response.register).toHaveLength(1)
    expect(response.register[0].path).toEqual("password")

    const users = await User.find()
    expect(users).toHaveLength(0)
  })
}) 
