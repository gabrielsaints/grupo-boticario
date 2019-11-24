import Normalize from './utils/normalize';
import User, { IUserDocument, isUser } from '../models/user';
import Order, { IOrderDocument, isOrder } from '../models/order';

import chance from './utils/chance';

import CashbackHelper from '../helpers/cashback';

describe('Orders', () => {
  let user: IUserDocument;
  let order: IOrderDocument;

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
    await order.remove();
    await user.remove();
    await Normalize.afterAll();
  });

  it('`orders` should create an order', async () => {
    expect.assertions(1);

    order = new Order({
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: chance.string(),
      document: chance.cpf(),
      user,
    });

    await order.save();

    expect(await Order.findOne({ _id: order.id })).toBeInstanceOf(Order);
  });

  it('`orders` should return an valid order', async () => {
    expect.assertions(5);

    const found = await Order.findOne({ _id: order.id });

    if (!found || !found.user) {
      fail('Order is invalid');
    }

    const userFound = await User.findOne({ _id: found.user });

    expect(found).toBeInstanceOf(Order);
    expect(isOrder(found)).toBe(true);
    expect(isUser(userFound)).toBe(true);
    expect(typeof found.cashback).toMatch('string');

    const cashback: string = found.cashback.toString();

    expect(typeof parseFloat(cashback)).toMatch('number');
  });

  it('`order` should update an order', async () => {
    expect.assertions(2);

    const oldPrice = order.price;
    const newPrice = chance.floating({ min: 900, max: 2000, fixed: 2 });

    order.price = newPrice;

    await order.save();

    expect(order.price === oldPrice).toBe(false);
    expect(order.price).toBe(newPrice.toFixed(2));
  });

  it('`order` should check if $900 returns $90 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(900.0)).toBe(90.0);
  });

  it('`order` should check if $1300 returns $195 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(1300.0)).toBe(195.0);
  });

  it('`order` should check if $1600 returns $320 of cashback', async () => {
    expect.assertions(1);

    expect(CashbackHelper.calculate(1600.0)).toBe(320.0);
  });

  it('`order` should remove an order', async () => {
    expect.assertions(2);

    const newOrder = new Order({
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: chance.string(),
      document: chance.cpf(),
      user,
    });

    await newOrder.save();
    expect(await Order.findOne({ _id: newOrder.id })).toBeInstanceOf(Order);

    await newOrder.remove();
    expect(await Order.findOne({ _id: newOrder.id })).toBe(null);
  });
});
