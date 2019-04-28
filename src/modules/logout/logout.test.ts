import { TestClient } from '../../testSetup/TestClient';
import { host } from '../../testSetup/testUtils';


const email = "email2@asdas.com"
const password = "test123"

describe("Logout module", () => {

  test('logout works', async (done) => {
    const client = new TestClient(host)
    const user = await client.createConfirmedUser(email, password)
    await client.login(email, password)
    const res = await client.me()

    expect(res.data).toEqual({
      me: {
        email: user.email,
        id: user.id
      }
    })

    await client.logout()
    const res2 = await client.me()

    expect(res2.data).toEqual({
      me: null
    })

    done()
  });

})
