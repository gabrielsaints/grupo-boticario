import { ErrorRequestHandler, RequestHandler } from 'express';

import { isHttpError } from '../helpers/http-error';

abstract class ErrorMiddleware {
  public static notFoundHandler(): RequestHandler {
    return (_, res) => {
      res.status(404).json({
        error: {
          message: 'Not found',
        },
      });
    };
  }

  public static exceptionHandler(): ErrorRequestHandler {
    return (err, _, res) => {
      let status: number;
      if (isHttpError(err)) {
        status = err.status;
      } else {
        status = 500;
      }
      if (status === 500) {
        // tslint:disable-next-line: no-console
        console.error(err);
      }
      const env = process.env.NODE_ENV;
      const message =
        env === 'production' && status === 500
          ? 'Internal server error'
          : err.message;
      res.status(status).json({
        error: {
          message,
        },
      });
    };
  }
}

export default ErrorMiddleware;
