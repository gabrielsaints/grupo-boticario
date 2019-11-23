import Normalize from './utils/normalize';
import User, { IUserDocument } from '../models/user';
import Sale, { ISaleDocument } from '../models/sale';

import chance from './utils/chance';

describe('Sales', () => {
  let user: IUserDocument;
  let sale: ISaleDocument;

  beforeAll(async () => {
    await Normalize.beforeAll();

    user = new User({
      email: chance.email(),
      password: await User.encryptPassword(chance.hash()),
      name: chance.name(),
      document: chance.cpf().replace(/[^\d]/g, ''),
    });
    await user.save();
  });

  afterAll(async () => {
    await sale.remove();
    await user.remove();
    await Normalize.afterAll();
  });

  it('`sales` should create an sale', async () => {
    expect.assertions(1);

    sale = new Sale({
      price: chance.floating({ min: 1, max: 15000, fixed: 2 }),
      status: chance.string(),
      user,
    });

    await sale.save();

    expect(await Sale.findOne({ _id: sale.id })).toBeInstanceOf(Sale);
  });

  it('`sales` should return an sale', async () => {
    expect.assertions(1);

    const found = await Sale.findOne({ _id: sale.id });

    expect(found).toBeInstanceOf(Sale);
  });

  it('`sale` should update an sale', async () => {
    expect.assertions(2);

    const oldPrice = sale.price;
    const newPrice = chance.floating({ min: 1, max: 15000, fixed: 2 });

    sale.price = newPrice;

    await sale.save();

    expect(sale.price === oldPrice).toBe(false);
    expect(sale.price).toBe(newPrice.toString());
  });

  it('`sale` should remove an sale', async () => {
    expect.assertions(2);

    const newSale = new Sale({
      price: chance.floating({ min: 1, max: 15000, fixed: 2 }),
      status: chance.string(),
      user,
    });

    await newSale.save();
    expect(await Sale.findOne({ _id: newSale.id })).toBeInstanceOf(Sale);

    await newSale.remove();
    expect(await Sale.findOne({ _id: newSale.id })).toBe(null);
  });
});
