import { Document, model, Model, Schema } from 'mongoose';

import EncryptionHelper from '../helpers/encryption';

interface IUserSerialized {
  _id: string;
  name: string;
  email: string;
  document: string;
  active: boolean;
  lastLogin: Date;
}

interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  document: string;
  active: boolean;
  lastToken: string;
  lastLogin: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: (
    body: object,
    secret: string,
    expiresAt?: string,
  ) => Promise<string>;
  serialize: () => IUserSerialized;
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
  lastToken: {
    type: String,
    required: false,
  },
  lastLogin: {
    type: Date,
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

USER_SCHEMA.methods.comparePassword = async function(password: string) {
  return EncryptionHelper.comparePassword(password, this.password);
};

USER_SCHEMA.methods.serialize = function(password: string) {
  let user: IUserSerialized;

  user = {
    _id: this.id,
    name: this.name,
    email: this.email,
    document: this.document,
    lastLogin: this.lastLogin,
    active: this.active,
  };

  return user;
};

USER_SCHEMA.methods.generateToken = async function(
  body: object,
  secret: string,
  expiresIn?: string,
) {
  return EncryptionHelper.generateToken(
    { ...body, user: this.serialize() },
    secret,
    expiresIn,
  );
};

USER_SCHEMA.statics.encryptPassword = EncryptionHelper.encryptPassword;

const isUser = (
  user: IUserModel | IUserSerialized | any,
): user is IUserModel => {
  return !!(user && user.email && user.name && user.document && user._id);
};

export { IUserDocument, IUserModel, isUser, IUserSerialized };

const USER: IUserModel = model<IUserDocument, IUserModel>('User', USER_SCHEMA);

export default USER;
