import { Document, model, Model, Schema, Types } from 'mongoose';

import { IUserDocument } from './user';

interface ISaleDocument extends Document {
  value: number;
  status: string;
  user: IUserDocument;
}

interface ISaleModel extends Model<ISaleDocument> {}

const SALE_SCHEMA = new Schema(
  {
    value: {
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

// Getter
SALE_SCHEMA.path('price').get((num): string => {
  return (num / 100).toFixed(2);
});

// Setter
SALE_SCHEMA.path('price').set((num): number => {
  return num * 100;
});

const isSale = (sale: ISaleModel | any): sale is ISaleModel => {
  return !!(sale && sale.value && sale.status);
};

export { ISaleDocument, ISaleModel, isSale };

const SALE: ISaleModel = model<ISaleDocument, ISaleModel>('Sale', SALE_SCHEMA);

export default SALE;
