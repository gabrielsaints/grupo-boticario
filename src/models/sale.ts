import { Document, model, Model, Schema, Types } from 'mongoose';

import { IUserDocument } from './user';

import CashbackHelper from '../helpers/cashback';

interface ISaleDocument extends Document {
  price: number;
  cashback: number;
  status: string;
  user: IUserDocument;
}

interface ISaleModel extends Model<ISaleDocument> {}

const SALE_SCHEMA = new Schema(
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
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

SALE_SCHEMA.pre<ISaleDocument>('save', function(next) {
  this.cashback = CashbackHelper.calculate(this.price);
  next();
});

SALE_SCHEMA.path('price').get((num: number): string => {
  return (num / 100).toFixed(2);
});

SALE_SCHEMA.path('price').set((num: number): number => {
  return num * 100;
});

SALE_SCHEMA.path('cashback').get((num: number): string => {
  return (num / 100).toFixed(2);
});

SALE_SCHEMA.path('cashback').set((num: number): number => {
  return num * 100;
});

const isSale = (sale: ISaleModel | any): sale is ISaleModel => {
  return !!(sale && sale.price && sale.status && sale._id && sale.user);
};

export { ISaleDocument, ISaleModel, isSale };

const SALE: ISaleModel = model<ISaleDocument, ISaleModel>('Sale', SALE_SCHEMA);

export default SALE;
