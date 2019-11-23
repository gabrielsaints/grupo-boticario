import express from 'express';

import { store } from '../controllers/users';

import { post } from '../schemas/users';

import Validate from '../helpers/validate';

const router = express.Router();

router.get('/users', Validate.fields('body', post), store);

export default router;
