import { TestClient } from '../../../testSetup/TestClient';
import { host } from '../../../testSetup/testUtils';

const email = 'email2@asdas.com';
const password = 'test123';
const emailN = 'noReg2@asdsa.com';
const passwordN = '123';

describe('Login module', () => {
  test('login valid', async done => {
    const client = new TestClient(host);
    await client.createConfirmedUser(email, password);
    const response = await client.login(email, password);
    expect(response.data).toEqual({ login: null });
    done();
  });

  test('login unconfirmed', async done => {
    const client = new TestClient(host);
    await client.register(email, password);

    const response = await client.login(email, password);
    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: 'please confirm your email',
        },
      ],
    });

    done();
  });

  test('login invalid email', async done => {
    const client = new TestClient(host);
    await client.createConfirmedUser(email, password);

    const response = await client.login(emailN, password);
    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: 'invalid credentials',
        },
      ],
    });

    done();
  });

  test('login invalid pass', async done => {
    const client = new TestClient(host);
    await client.createConfirmedUser(email, password);

    const response = await client.login(email, passwordN);

    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: 'invalid credentials',
        },
      ],
    });

    done();
  });
});
