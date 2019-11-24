import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import User, { isUser } from '../../models/user';

describe('API Users', () => {
  beforeAll(async () => {
    await Normalize.beforeAll();
  });

  afterAll(async () => {
    await Normalize.afterAll();
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
