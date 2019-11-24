import { RequestHandler } from 'express';

import User, { IUserDocument } from '../models/user';

import RequestError from '../helpers/request-error';

const signIn: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user: IUserDocument | null;

    user = await User.findOne({ email, active: true });

    if (!user) {
      throw new RequestError(
        401,
        'No one user has been found using this email',
      );
    }

    const valid = await user.comparePassword(password);

    if (!valid) {
      throw new RequestError(401, 'Password invalid');
    }

    const token = await user.generateToken(process.env.JWT_SECRET!);

    user.lastToken = token;
    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({ token, user: user.serialize() });
  } catch (err) {
    next(err);
  }
};

export { signIn };
