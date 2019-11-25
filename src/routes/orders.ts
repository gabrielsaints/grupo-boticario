import express from 'express';

import { post, put, del } from '../schemas/orders';

import { all, store, update, drop } from '../controllers/orders';

import isAuth from '../middlewares/is-auth';

import Validate from '../helpers/validate';

const router = express.Router();

router.get('/orders', isAuth, all);
router.post('/orders', Validate.fields('body', post), isAuth, store);
router.put('/orders', Validate.fields('body', put), isAuth, update);
router.delete('/orders/:id', Validate.fields('params', del), isAuth, drop);

export default router;
