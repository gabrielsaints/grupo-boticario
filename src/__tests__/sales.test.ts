import Normalize from './utils/normalize';
import User, { IUserDocument, isUser } from '../models/user';
import Sale, { ISaleDocument, isSale } from '../models/sale';

import chance from './utils/chance';

import CashbackHelper from '../helpers/cashback';

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
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: chance.string(),
      user,
    });

    await sale.save();

    expect(await Sale.findOne({ _id: sale.id })).toBeInstanceOf(Sale);
  });

  it('`sales` should return an valid sale', async () => {
    expect.assertions(5);

    const found = await Sale.findOne({ _id: sale.id });

    if (!found || !found.user) {
      fail('Sale is invalid');
    }

    const userFound = await User.findOne({ _id: found.user });

    expect(found).toBeInstanceOf(Sale);
    expect(isSale(found)).toBe(true);
    expect(isUser(userFound)).toBe(true);
    expect(typeof found.cashback).toMatch('string');

    const cashback: string = found.cashback.toString();

    expect(typeof parseFloat(cashback)).toMatch('number');
  });

  it('`sale` should update an sale', async () => {
    expect.assertions(2);

    const oldPrice = sale.price;
    const newPrice = chance.floating({ min: 900, max: 2000, fixed: 2 });

    sale.price = newPrice;

    await sale.save();

    expect(sale.price === oldPrice).toBe(false);
    expect(sale.price).toBe(newPrice.toFixed(2));
  });

  it('`sale` should check if $900 returns $90 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(900.0)).toBe(90.0);
  });

  it('`sale` should check if $1300 returns $195 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(1300.0)).toBe(195.0);
  });

  it('`sale` should check if $1600 returns $320 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(1600.0)).toBe(320.0);
  });

  it('`sale` should remove an sale', async () => {
    expect.assertions(2);

    const newSale = new Sale({
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: chance.string(),
      user,
    });

    await newSale.save();
    expect(await Sale.findOne({ _id: newSale.id })).toBeInstanceOf(Sale);

    await newSale.remove();
    expect(await Sale.findOne({ _id: newSale.id })).toBe(null);
  });
});
