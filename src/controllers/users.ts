import { RequestHandler } from 'express';

import RequestError from '../helpers/request-error';

import User from '../models/user';

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

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        document: user.document,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { store };
