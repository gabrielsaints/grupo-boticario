import express from 'express';

import { store, cashback } from '../controllers/users';

import { post, getCashback } from '../schemas/users';

import isAuth from '../middlewares/is-auth';

import Validate from '../helpers/validate';

const router = express.Router();

router.get(
  '/users/:document/cashback',
  Validate.fields('params', getCashback),
  isAuth,
  cashback,
);
router.post('/users', Validate.fields('body', post), store);

export default router;
