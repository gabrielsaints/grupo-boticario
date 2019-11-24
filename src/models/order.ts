import { Document, model, Model, Schema, Types } from 'mongoose';

import User, { IUserDocument, IUserSerialized } from './user';

import CashbackHelper from '../helpers/cashback';

interface IOrderSerialized {
  _id: string;
  price: number;
  cashback: number;
  document: string;
  status: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  user: IUserSerialized | null;
}

interface IOrderDocument extends Document {
  price: number;
  date: Date;
  cashback: number;
  document: string;
  status: string;
  user: IUserDocument;
  serialize: () => Promise<IOrderSerialized>;
}

interface IOrderModel extends Model<IOrderDocument> {}

const ORDER_SCHEMA = new Schema(
  {
    cashback: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Em validação',
    },
    document: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: false,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
);

ORDER_SCHEMA.pre<IOrderDocument>('save', function(next) {
  this.cashback = CashbackHelper.calculate(this.price);
  next();
});

ORDER_SCHEMA.methods.serialize = async function() {
  let order: IOrderSerialized;

  const user: IUserDocument | null = await User.findOne({ _id: this.user });

  order = {
    _id: this._id,
    price: this.price,
    cashback: this.cashback,
    document: this.document,
    status: this.status,
    date: this.date,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    user: (user && user.serialize()) || null,
  };

  return order;
};

ORDER_SCHEMA.path('price').get((num: number): string => {
  return (num / 100).toFixed(2);
});

ORDER_SCHEMA.path('price').set((num: number): number => {
  return num * 100;
});

ORDER_SCHEMA.path('cashback').get((num: number): string => {
  return (num / 100).toFixed(2);
});

ORDER_SCHEMA.path('cashback').set((num: number): number => {
  return num * 100;
});

const isOrder = (order: IOrderModel | any): order is IOrderModel => {
  return !!(
    order &&
    order.price &&
    order.status &&
    order.document &&
    order._id &&
    order.user
  );
};

export { IOrderDocument, IOrderModel, isOrder, IOrderSerialized };

const SALE: IOrderModel = model<IOrderDocument, IOrderModel>(
  'Order',
  ORDER_SCHEMA,
);

export default SALE;
