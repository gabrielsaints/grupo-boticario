import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import User, { isUser, IUserDocument } from '../../models/user';

describe('API Users', () => {
  let user: IUserDocument;
  let token: string | null;
  const document: string = chance.cpf();
  const password: string = chance.hash();

  beforeAll(async () => {
    await Normalize.beforeAll();

    user = new User({
      email: chance.email(),
      password: await User.encryptPassword(password),
      name: chance.name(),
      document,
    });

    await user.save();
  });

  afterAll(async () => {
    await user.remove();
    await Normalize.afterAll();
  });

  beforeEach(async () => {
    const response = await request()
      .post('/auth')
      .send({
        email: user.email,
        password,
      });

    token = response.body.token;
  });

  afterEach(async () => {
    token = null;
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
    expect.assertions(4);
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

    const user = await User.findOne({
      _id: response.body.user._id,
    });

    expect(user).not.toBeNull();

    if (!user) {
      fail();
    }

    expect(isUser(user)).toBe(true);

    await user.remove();
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

  test('`POST /users` should return `409` using an duplicated email', async () => {
    expect.assertions(6);
    const email = chance.email();
    let response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email,
        document: chance.cpf().replace(/[^\d]/g, ''),
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();

    const user = await User.findOne({
      _id: response.body.user._id,
    });

    expect(user).not.toBeNull();

    if (!user) {
      fail();
    }

    expect(isUser(user)).toBe(true);

    response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email,
        document: chance.cpf().replace(/[^\d]/g, ''),
      });

    expect(response.status).toBe(409);
    expect(response.body.user).toBeUndefined();

    await user.remove();
  });

  test('`POST /users` should return `409` using an duplicated document', async () => {
    expect.assertions(6);
    const document = chance.cpf();
    let response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email: chance.email(),
        document,
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();

    const user = await User.findOne({
      _id: response.body.user._id,
    });

    expect(user).not.toBeNull();

    if (!user) {
      fail();
    }

    expect(isUser(user)).toBe(true);

    response = await request()
      .post('/users')
      .send({
        name: chance.name(),
        password: chance.hash(),
        email: chance.email(),
        document,
      });

    expect(response.status).toBe(409);
    expect(response.body.user).toBeUndefined();

    await user.remove();
  });
});
