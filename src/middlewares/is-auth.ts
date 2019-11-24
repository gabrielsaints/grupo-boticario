import jwt from 'jsonwebtoken';

import { RequestHandler } from 'express';

import RequestError from '../helpers/request-error';
import User, { isUser, IUserDocument } from '../models/user';

const getTokenUser = async (data: any): Promise<IUserDocument> => {
  if (!data || typeof data === 'string') {
    throw new Error('Invalid token');
  }

  if (!isUser(data.user)) {
    throw new Error('Invalid token');
  }

  const user = await User.findOne({
    _id: data.user._id,
    active: true,
  });

  if (!user) {
    throw new Error('Invalid token');
  }

  return user;
};

const decodifyToken = (token: string, secret?: string): object | string =>
  jwt.verify(token, secret || process.env.JWT_SECRET!);

const isAuth: RequestHandler = async (req: any, _, next) => {
  try {
    const auth = req.get('X-Authorization');
    if (!auth) {
      throw new RequestError(401, 'Not authenticated');
    }

    if (!auth.startsWith('Bearer ')) {
      throw new RequestError(401, 'Invalid credentials');
    }

    const token = auth.slice(7, auth.length);

    let data: any;

    try {
      data = decodifyToken(token);
    } catch (err) {
      throw RequestError.fromError(401, err);
    }

    try {
      req.user = await getTokenUser(data);
    } catch (err) {
      throw new RequestError(401, err.message);
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default isAuth;

export { getTokenUser, decodifyToken };
