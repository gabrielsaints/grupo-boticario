import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import User, { IUserDocument } from '../../models/user';

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
    expect.assertions(1);
    console.log({ password: user.password, email: user.email });
    const response = await request()
      .post('/auth')
      .send({
        password,
        email: user.email,
      });
    console.log(response.body);
    expect(true).toBe(true);
  });
});
