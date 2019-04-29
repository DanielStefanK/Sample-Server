// tslint:disable-next-line: no-implicit-dependencies
import fetch from 'node-fetch';
import * as Redis from 'ioredis';

import { User } from '../../../entity/User';
import { createConfirmEmailLink } from '../../../utils/createConfirmEmail';
import { host } from '../../../testSetup/testUtils';
import { TestClient } from '../../../testSetup/TestClient';

const email = 'email@asdas.com';
const password = 'test123';

const faultyEmail = 'e';
const faultyPass = '1';

const redis = new Redis();

describe('Register module', () => {
  test('Register User', async done => {
    const client = new TestClient(host);
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];

    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    done();
  });

  test('Register Duplicate fails', async done => {
    const client = new TestClient(host);
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });

    const regAgain: any = await client.register(email, password);
    expect(regAgain.data.register).toHaveLength(1);

    expect(regAgain.data.register[0].path).toEqual('email');
    const usersAgain = await User.find({ where: { email } });
    expect(usersAgain).toHaveLength(1);
    done();
  });

  test('Invalid Register Input', async () => {
    const client = new TestClient(host);
    const response = await client.register(faultyEmail, faultyPass);
    expect(response.data.register).toHaveLength(3);

    const users = await User.find();
    expect(users).toHaveLength(0);
  });

  test('Invalid Email Register', async () => {
    const client = new TestClient(host);
    const response = await client.register('asdasdasdasd', password);
    expect(response.data.register).toHaveLength(1);
    expect(response.data.register[0].path).toEqual('email');

    const users = await User.find();
    expect(users).toHaveLength(0);
  });

  test('Invalid Password Register', async () => {
    const client = new TestClient(host);
    const response = await client.register(email, faultyPass);
    expect(response.data.register).toHaveLength(1);
    expect(response.data.register[0].path).toEqual('password');

    const users = await User.find();
    expect(users).toHaveLength(0);
  });

  test('Test Email confirmation Link', async done => {
    const { id, confirmed } = await User.create({ email, password }).save();

    expect(confirmed).toBeFalsy();

    const url = await createConfirmEmailLink(host, id, redis);

    const res = await fetch(url);
    const text = await res.text();
    expect(text).toEqual('ok');

    const user = (await User.findOne({ where: { id } })) as User;
    expect(user.confirmed).toBe(true);

    const second = await fetch(url);
    const text2 = await second.text();
    expect(text2).toEqual('Not found');
    done();
  });
});
