import { request } from 'graphql-request'
import { User } from '../../entity/User';
import { startServer } from '../../startServer';
import { AddressInfo } from 'net';

const email = "email@asdas.com"
const password = "test123"

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

let getHost = () => ''

beforeAll(async () => {
  const app = await startServer()
  const { port } = app.address() as AddressInfo
  getHost = () => `http://127.0.0.1:${port}`
})

test('Register User', async () => {
  const response = await request(getHost(), mutation)
  expect(response).toEqual({ register: null })
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)

  const user = users[0]

  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)

  const regAgain: any = await request(getHost(), mutation)
  expect(regAgain.register).toHaveLength(1)

  expect(regAgain.register[0].path).toEqual("email")
  const usersAgain = await User.find({ where: { email } })
  expect(usersAgain).toHaveLength(1)
});