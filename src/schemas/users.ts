import Joi from '@hapi/joi';

const post = Joi.object().keys({
  name: Joi.string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/)
    .required(),
  document: Joi.string()
    .trim()
    .replace(/[^\d]/g, '')
    .regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(3)
    .required(),
});

export { post };
