import Joi from '@hapi/joi';

import Validate from '../helpers/validate';

const post = Joi.object().keys({
  price: Joi.number()
    .min(0.1)
    .required(),
  document: Joi.string()
    .trim()
    .replace(/[^\d]/g, '')
    .regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/)
    .required(),
  date: Joi.date().default(new Date()),
});

const put = Joi.object().keys({
  id: Joi.custom((value: any, helpers: any) => {
    if (!Validate.objectId(value)) {
      return helpers.error('ObjectId is invalid');
    }

    return value;
  }),
  price: Joi.number().min(0.1),
  document: Joi.string()
    .trim()
    .replace(/[^\d]/g, '')
    .regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/),
  date: Joi.date(),
});

const del = Joi.object().keys({
  id: Joi.custom((value: any, helpers: any) => {
    if (!Validate.objectId(value)) {
      return helpers.error('ObjectId is invalid');
    }

    return value;
  }),
});

export { post, put, del };
