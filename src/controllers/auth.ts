import { RequestHandler } from 'express';

import User from '../models/user';

const signIn: RequestHandler = async (req, res) => {
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
};

export { signIn };
