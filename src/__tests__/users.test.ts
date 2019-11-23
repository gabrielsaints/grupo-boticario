import User, { IUserDocument, isUser } from './../models/user';

import chance from './utils/chance';

import Normalize from './utils/normalize';

describe('Users', () => {
  let user: IUserDocument;
  beforeAll(async () => {
    await Normalize.beforeAll();
  });

  afterAll(async () => {
    await Normalize.afterAll();
  });

  it('`users` should be able to register user', async () => {
    expect.assertions(1);

    user = new User({
      email: chance.email(),
      password: await User.encryptPassword(chance.hash()),
      name: chance.name(),
      document: chance.cpf().replace(/[^\d]/g, ''),
    });

    await user.save();

    expect(await User.findOne({ _id: user.id })).toBeInstanceOf(User);
  });

  it('`users` should be able to return an user', async () => {
    expect.assertions(2);
    const found = await User.findOne({ _id: user.id });

    expect(found).toBeInstanceOf(User);
    expect(isUser(found)).toBe(true);
  });

  it('`users` should be able to update user', async () => {
    expect.assertions(2);

    const oldName = user.name;
    const newName = chance.name();

    user.name = newName;

    await user.save();

    expect(user.name).toMatch(newName);
    expect(user.name === oldName).toBe(false);
  });

  it('`users` should be able to remove user', async () => {
    expect.assertions(1);
    await user.remove();

    expect(await User.findOne({ _id: user.id })).toBe(null);
  });
});
