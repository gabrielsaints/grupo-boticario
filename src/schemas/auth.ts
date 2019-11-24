import Joi from '@hapi/joi';

const post = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(3)
    .max(50)
    .required(),
});

export { post };
