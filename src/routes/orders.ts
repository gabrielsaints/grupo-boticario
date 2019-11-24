import express from 'express';

import { post, put } from '../schemas/orders';

import { store, update } from '../controllers/orders';

import isAuth from '../middlewares/is-auth';

import Validate from '../helpers/validate';

const router = express.Router();

router.post('/orders', Validate.fields('body', post), isAuth, store);
router.put('/orders', Validate.fields('body', put), isAuth, update);

export default router;
