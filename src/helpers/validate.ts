import { ObjectSchema } from '@hapi/joi';
import { RequestHandler } from 'express';

import RequestError from '../helpers/request-error';

const methods = ['query', 'params', 'body'];

abstract class Validate {
  public static fields(field: string, schema: ObjectSchema): RequestHandler {
    if (!methods.includes(field)) {
      throw new RequestError(500, 'Route has no valid type of validation');
    }

    return (req, _, next) => {
      try {
        let data = {};

        if (field === 'body') {
          data = req.body;
        } else if (field === 'params') {
          data = req.params;
        } else if (field === 'query') {
          data = req.query;
        }

        const response = schema.validate(data);

        if (response.error) {
          // tslint:disable-next-line: no-console
          console.log(data);
          // tslint:disable-next-line: no-console
          console.log(response.error);

          throw new RequestError(422, response.error.message);
        }

        if (field === 'body') {
          req.body = response.value;
        } else if (field === 'params') {
          req.params = response.value;
        } else if (field === 'query') {
          req.query = response.value;
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default Validate;
