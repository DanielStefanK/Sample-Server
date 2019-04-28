import { host } from '../../testSetup/testUtils';
import { TestClient } from '../../testSetup/TestClient';

const email = "email2@asdas.com"
const password = "test123"

describe("me query", () => {

  test('with login', async (done) => {
    const client = new TestClient(host)

    const user = await client.createConfirmedUser(email, password)

    await client.login(email, password)


    const response = await client.me()

    expect(response.data).toEqual({
      me: {
        id: user.id,
        email: user.email
      }
    })

    done()
  });


  test('without login', async (done) => {
    const client = new TestClient(host)
    const response = await client.me()

    expect(response.data).toEqual({
      me: null
    })

    done()
  });

})
