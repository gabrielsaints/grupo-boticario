import { RequestHandler } from 'express';

import RequestError from '../helpers/request-error';

import Validate from '../helpers/validate';
import Order, { IOrderSerialized, IOrderDocument } from '../models/order';

const all: RequestHandler = async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length ||
      Object.keys(req.params).length ||
      Object.keys(req.query).length
    ) {
      throw new RequestError(400, 'Bad request');
    }

    const orders: IOrderDocument[] = await Order.find({});

    res.status(200).json({
      orders: await Promise.all(
        orders.map(
          async (order): Promise<IOrderSerialized> => order.serialize(),
        ),
      ),
    });
  } catch (err) {
    next(err);
  }
};

const store: RequestHandler = async (req, res, next) => {
  try {
    let status: string = 'EM VALIDAÇÃO';

    if (Object.keys(req.params).length || Object.keys(req.query).length) {
      throw new RequestError(400, 'Bad request');
    }

    if (req.body.document === '15350946056') {
      status = 'APROVADO';
    }

    const order: IOrderDocument = new Order({
      price: req.body.price,
      document: req.body.document,
      status,
      user: req.user,
      date: req.body.date,
    });

    await order.save();

    res.status(201).json({
      order: await order.serialize(),
    });
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const mustBe: string = 'EM VALIDAÇÃO';
    const updated: object[] = [];
    let old: any;

    const order: IOrderDocument | null = await Order.findById(req.body.id);

    if (!order) {
      throw new RequestError(404, 'Not found');
    }

    if (!order.status.match(mustBe)) {
      throw new RequestError(405, "You aren't allowed to edit this field");
    }

    old = await order.serialize();

    if (req.body.price) {
      updated.push({
        key: 'price',
        from: order.price,
        to: req.body.price,
      });
      order.price = req.body.price;
    }

    if (req.body.date) {
      updated.push({
        key: 'date',
        from: order.date,
        to: req.body.date,
      });
      order.date = req.body.date;
    }

    if (req.body.document) {
      updated.push({
        key: 'document',
        from: order.document,
        to: req.body.document,
      });
      order.document = req.body.document;
    }

    await order.save();

    if (old.cashback !== order.cashback) {
      updated.push({
        key: 'cashback',
        from: old.cashback,
        to: order.cashback,
      });
    }

    res.status(200).json({
      order: await order.serialize(),
      updated,
    });
  } catch (err) {
    next(err);
  }
};
const drop: RequestHandler = async (req, res, next) => {
  try {
    const mustBe: string = 'EM VALIDAÇÃO';

    const order: IOrderDocument | null = await Order.findById(req.params.id);

    if (!order) {
      throw new RequestError(404, 'Not found');
    }

    if (!order.status.match(mustBe)) {
      throw new RequestError(405, "You aren't allowed to edit this field");
    }

    await order.remove();

    res.status(204).send('ok');
  } catch (err) {
    next(err);
  }
};

export { store, update, drop, all };
