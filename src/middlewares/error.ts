import { ErrorRequestHandler, RequestHandler } from 'express';

import RequestError, { isRequestError } from '../helpers/request-error';

const notFound: RequestHandler = (req, res, next) => {
  next(new RequestError(404, 'Resource not found'));
};

const exception: ErrorRequestHandler = (err, req, res, next) => {
  const status = isRequestError(err) ? err.status : 500;
  const message: string = err.message;
  res.status(status).json({ error: { message } });
};

export { notFound, exception };

export default {
  notFound,
  exception,
};
