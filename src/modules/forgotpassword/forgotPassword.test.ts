import * as Redis from 'ioredis'

import { TestClient } from '../../testSetup/TestClient';
import { host } from '../../testSetup/testUtils';
import { createForgotPasswordEmail } from '../../utils/createForgotPasswordEmail';
import { forgotPasswordLockAccount } from '../../utils/forgotPasswordLockAccount';


const email = "email2@asdas.com"
const password = "test123"
const newPassword = "newnewnew1"
const newFaultyPassword = "ne"

const redis = new Redis()

describe("Forgot password module", () => {
  test('forgot logout email', async (done) => {
    const client = new TestClient(host)
    const user = await client.createConfirmedUser(email, password)
    await forgotPasswordLockAccount(user.id, redis)
    const token = (await createForgotPasswordEmail('test', user.id, redis)).split('/')[2]

    expect((await client.login(email, password)).data).toEqual({
      login: [{
        path: "login",
        message: "please recover your password"
      }]
    })

    expect((await client.changePasswordWithToken(newFaultyPassword, token)).data).toEqual({
      changePasswordWithToken: [
        {
          "message": "newPassword must be at least 3 characters",
          "path": "newPassword",
        },
      ]
    })

    expect((await client.changePasswordWithToken(newPassword, token)).data).toEqual({
      changePasswordWithToken: null
    })

    expect((await client.changePasswordWithToken(newPassword, token)).data).toEqual({
      changePasswordWithToken: [{
        path: "authentication",
        message: "invalid token"
      }]
    })

    expect((await client.login(email, newPassword)).data).toEqual({
      login: null
    })

    done()
  })
})
