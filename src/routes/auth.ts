import express from 'express';

import { signIn } from '../controllers/auth';

import { post } from '../schemas/auth';

import Validate from '../helpers/validate';

const router = express.Router();

router.post('/auth', Validate.fields('body', post), signIn);

export default router;
