import { Document, model, Model, Schema } from 'mongoose';

import EncryptionHelper from '../helpers/encryption';

interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  document: string;
  comparePassword: (password: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  encryptPassword: (password: string) => Promise<string>;
}

const USER_SCHEMA = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
    unique: true,
  },
});

USER_SCHEMA.methods.comparePassword = async function(password: string) {
  return EncryptionHelper.comparePassword(password, this.password);
};

USER_SCHEMA.statics.encryptPassword = EncryptionHelper.encryptPassword;

const isUser = (user: IUserModel | any): user is IUserModel => {
  return !!(user && user.email && user.password && user.name && user.document);
};

export { IUserDocument, IUserModel, isUser };

const USER: IUserModel = model<IUserDocument, IUserModel>('User', USER_SCHEMA);

export default USER;
