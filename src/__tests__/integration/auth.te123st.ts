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
});
