import { request } from 'graphql-request'
import { User } from '../../entity/User';
import { startServer } from '../../startServer';
import { AddressInfo } from 'net';

const email = "email@asdas.com"
const password = "test123"

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
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
  expect(response).toEqual({ register: true })
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)
});