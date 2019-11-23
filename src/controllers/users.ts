import { RequestHandler } from 'express';

const store: RequestHandler = (_, res) => {
  res.send('oi');
};

export { store };
