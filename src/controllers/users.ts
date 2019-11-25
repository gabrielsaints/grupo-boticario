import { RequestHandler } from 'express';

import RequestError from '../helpers/request-error';

import axios, { AxiosInstance } from 'axios';

import User, { IUserSerialized } from '../models/user';

const store: RequestHandler = async (req, res, next) => {
  try {
    let already = await User.find({ email: req.body.email });

    if (already.length) {
      throw new RequestError(
        409,
        `Already exists an \`user\` using \`${req.body.email}\` for \`email\``,
      );
    }

    already = await User.find({ document: req.body.document });

    if (already.length) {
      throw new RequestError(
        409,
        `Already exists an \`user\` using \`${req.body.document}\` for \`document\``,
      );
    }

    const user = new User({
      ...req.body,
      password: await User.encryptPassword(req.body.password),
    });

    await user.save();

    let response: IUserSerialized;

    response = user.serialize();

    res.status(201).json({
      user: response,
    });
  } catch (err) {
    next(err);
  }
};

const cashback: RequestHandler = async (req: any, res, next) => {
  try {
    let body: any;

    const api: AxiosInstance = axios.create({
      baseURL: process.env.CASHBACK_API,
    });

    try {
      if (req.dev) {
        throw new Error('Method not allowed');
      }

      const response = await api.get('/cashback', {
        params: {
          cpf: req.testing ? undefined : req.params.document,
        },
        headers: {
          token: process.env.CASHBACK_API_TOKEN,
        },
      });

      body = response.data.body;

      if (!body.credit) {
        throw new RequestError(400, 'Missing document parameter');
      }
    } catch (error) {
      throw error;
    }

    res.status(200).json({
      cashback: body.credit,
    });
  } catch (err) {
    next(err);
  }
};

export { store, cashback };
