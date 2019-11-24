import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import User, { IUserDocument } from '../../models/user';

import { decodifyToken, getTokenUser } from '../../middlewares/is-auth';

describe('API Users', () => {
  let user: IUserDocument;
  const password: string = chance.hash();
  beforeAll(async () => {
    await Normalize.beforeAll();
    user = new User({
      email: chance.email(),
      password: await User.encryptPassword(password),
      name: chance.name(),
      document: chance.cpf().replace(/[^\d]/g, ''),
    });

    await user.save();
  });

  afterAll(async () => {
    await user.remove();
    await Normalize.afterAll();
  });

  test('`POST /auth` should return `200` with an new token', async () => {
    expect.assertions(5);
    const response = await request()
      .post('/auth')
      .send({
        password,
        email: user.email,
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();

    const { token } = response.body;

    const data = decodifyToken(token);
    expect(data).toBeInstanceOf(Object);

    const tokenUser: IUserDocument = await getTokenUser(data);
    expect(tokenUser).toBeInstanceOf(User);
  });

  test('`POST` /auth should return `401` with invalid user', async () => {
    expect.assertions(4);
    const response = await request()
      .post('/auth')
      .send({
        password: chance.hash(),
        email: chance.email(),
      });
    expect(response.status).toBe(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.user).not.toBeDefined();
    expect(response.body.error.message).toMatch('email');
  });

  test('`POST` /auth should return `401` with invalid password', async () => {
    expect.assertions(4);
    const response = await request()
      .post('/auth')
      .send({
        password: chance.hash(),
        email: user.email,
      });
    expect(response.status).toBe(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.user).not.toBeDefined();
    expect(response.body.error.message).toMatch('Password invalid');
  });

  test('`POST` /auth should return `422` with invalid schema', async () => {
    expect.assertions(3);
    const response = await request()
      .post('/auth')
      .send({
        password: chance.hash(),
        name: user.name,
      });
    expect(response.status).toBe(422);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.user).not.toBeDefined();
  });
});
