import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import User, { isUser, IUserDocument } from '../../models/user';

describe('API Users', () => {
  let user: IUserDocument;
  let token: string | null;
  const email: string = chance.email();
  const document: string = chance.cpf();
  const password: string = chance.hash();

  beforeAll(async () => {
    await Normalize.beforeAll();
    user = new User({
      email,
      password: await User.encryptPassword(password),
      name: chance.name(),
      document,
    });

    await user.save();

    const response = await request()
      .post('/auth')
      .send({
        email: user.email,
        password,
      });

    token = response.body.token;
  });

  afterAll(async () => {
    token = null;

    await user.remove();
    await Normalize.afterAll();
  });

  test('`POST /users` should return `409` using an duplicated email', async () => {
    expect.assertions(2);

    const response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email: user.email,
        document: chance.cpf().replace(/[^\d]/g, ''),
      });

    expect(response.status).toBe(409);
    expect(response.body.user).toBeUndefined();
  });

  test('`POST /users` should return `409` using an duplicated document', async () => {
    expect.assertions(2);

    const response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email: chance.email(),
        document: user.document,
      });

    expect(response.status).toBe(409);
    expect(response.body.user).toBeUndefined();
  });

  test('`GET` /users/:document/cashback should return `200` with value', async () => {
    expect.assertions(2);

    const response = await request()
      .get(`/users/${document}/cashback`)
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.cashback).toBeDefined();
  });

  test('`GET` /users/:document/cashback should return `400` missing docs in request', async () => {
    expect.assertions(2);

    const response = await request()
      .get(`/users/${document}/cashback`)
      .set({
        'X-Authorization': `Bearer ${token}`,
        'X-Testing': '1',
      });

    expect(response.status).toBe(400);
    expect(response.body.cashback).not.toBeDefined();
  });

  test('`GET` /users/:document/cashback should return `500` internal error', async () => {
    expect.assertions(2);

    const response = await request()
      .get(`/users/${document}/cashback`)
      .set({
        'X-Authorization': `Bearer ${token}`,
        'X-Dev': '1',
      });

    expect(response.status).toBe(500);
    expect(response.body.cashback).not.toBeDefined();
  });

  test('`GET` /users/:document/cashback should return `422` with value', async () => {
    expect.assertions(2);

    const response = await request()
      .get(`/users/${chance.identity()}/cashback`)
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(422);
    expect(response.body.cashback).not.toBeDefined();
  });

  test('`POST /users` should return `201` with an object of User', async () => {
    expect.assertions(3);
    const response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email: chance.email(),
        document: chance.cpf().replace(/[^\d]/g, ''),
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();

    const userTesting = await User.findById(response.body.user._id);

    expect(userTesting).not.toBeNull();

    if (!userTesting) {
      fail();
    }

    await userTesting.remove();
  });

  test('`POST /users` should return `422` using an invalid object', async () => {
    expect.assertions(2);
    const response = await request()
      .post('/users')
      .send({
        name: chance.int(),
        document: chance.cpf().replace(/[^\d]/g, ''),
      });

    expect(response.status).toBe(422);
    expect(response.body.user).toBeUndefined();
  });
});
