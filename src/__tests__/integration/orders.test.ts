import request from '../utils/request';

import chance from '../utils/chance';
import Normalize from '../utils/normalize';

import { Types } from 'mongoose';

import User, { IUserDocument } from '../../models/user';
import Order, {
  IOrderDocument,
  IOrderSerialized,
  isOrder,
} from '../../models/order';

const DEFAULT_DOCUMENT = '53792389045';
const SPECIAL_DOCUMENT = '15350946056';

describe('API Users', () => {
  let user: IUserDocument;
  let token: string | null;
  let orderDefault: IOrderDocument;
  let orderSpecial: IOrderDocument;
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

    orderDefault = new Order({
      document: DEFAULT_DOCUMENT,
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: 'Em validação',
      user,
    });

    await orderDefault.save();

    orderSpecial = new Order({
      document: DEFAULT_DOCUMENT,
      price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      status: 'Aprovado',
      user,
    });

    await orderSpecial.save();
  });

  afterAll(async () => {
    await orderSpecial.remove();
    await orderDefault.remove();
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

  test('`POST` /orders should return `201` and create an order', async () => {
    expect.assertions(4);

    const response = await request()
      .post('/orders')
      .send({
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.order).toBeDefined();

    const orderRequest: IOrderSerialized = response.body.order;

    expect(isOrder(orderRequest)).toBe(true);

    const order: IOrderDocument | null = await Order.findOne(orderRequest);

    if (!order) {
      fail();
    }

    expect(order).toBeInstanceOf(Order);

    await order.remove();
  });

  test('`POST` /orders should return `201` and create an order with default status', async () => {
    expect.assertions(5);

    const response = await request()
      .post('/orders')
      .send({
        document: DEFAULT_DOCUMENT,
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.order).toBeDefined();
    expect(response.body.order.status).toMatch('Em validação');

    const orderRequest: IOrderSerialized = response.body.order;

    expect(isOrder(orderRequest)).toBe(true);

    const order: IOrderDocument | null = await Order.findOne(orderRequest);

    if (!order) {
      fail();
    }

    expect(order).toBeInstanceOf(Order);

    await order.remove();
  });

  test('`POST` /orders should return `201` and create an order with special status', async () => {
    expect.assertions(5);

    const response = await request()
      .post('/orders')
      .send({
        document: SPECIAL_DOCUMENT,
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.order).toBeDefined();
    expect(response.body.order.status).toMatch('Aprovado');

    const orderRequest: IOrderSerialized = response.body.order;

    expect(isOrder(orderRequest)).toBe(true);

    const order: IOrderDocument | null = await Order.findOne(orderRequest);

    if (!order) {
      fail();
    }

    expect(order).toBeInstanceOf(Order);

    await order.remove();
  });

  test('`POST` /orders should return `422` with invalid schema', async () => {
    expect.assertions(2);

    const response = await request()
      .post('/orders')
      .send({
        document: chance.cpf(),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(422);
    expect(response.body.order).not.toBeDefined();
  });

  test('`POST` /orders should return `401` with invalid token', async () => {
    expect.assertions(2);

    const response = await request()
      .post('/orders')
      .send({
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
      })
      .set({
        'X-Authorization': `Beer ${token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.order).not.toBeDefined();
  });

  test('`PUT` /orders should return `200` and will be able to update an order', async () => {
    expect.assertions(3);

    const response = await request()
      .put('/orders')
      .send({
        id: orderDefault.id,
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
        date: new Date(),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.order).toBeDefined();
    expect(response.body.updated).toBeDefined();
  });

  test('`PUT` /orders should return `404` trying to edit an inexistent order', async () => {
    expect.assertions(3);

    const response = await request()
      .put('/orders')
      .send({
        id: Types.ObjectId(),
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
        date: new Date(),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body.order).not.toBeDefined();
    expect(response.body.updated).not.toBeDefined();
  });

  test('`PUT` /orders should return `405` trying to edit an special order', async () => {
    expect.assertions(3);

    const response = await request()
      .put('/orders')
      .send({
        id: orderSpecial.id,
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
        date: new Date(),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(405);
    expect(response.body.order).not.toBeDefined();
    expect(response.body.updated).not.toBeDefined();
  });

  test('`PUT` /orders should return `422` trying to edit with invalid ObjectId', async () => {
    expect.assertions(3);

    const response = await request()
      .put('/orders')
      .send({
        id: chance.hash(),
        document: chance.cpf(),
        price: chance.floating({ min: 900, max: 2000, fixed: 2 }),
        date: new Date(),
      })
      .set({
        'X-Authorization': `Bearer ${token}`,
      });

    expect(response.status).toBe(422);
    expect(response.body.order).not.toBeDefined();
    expect(response.body.updated).not.toBeDefined();
  });
});
