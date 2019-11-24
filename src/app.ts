import Server from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import errors from './middlewares/error';

import UsersRouter from './routes/users';
import AuthRouter from './routes/auth';

import './config/env';

interface IApp {
  server: Server.Express;
}

class App implements IApp {
  public server: Server.Express;

  constructor() {
    this.server = Server();

    this.middlewares();
    this.routes();
    this.listeners();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(bodyParser.json());
  }

  private routes(): void {
    this.server.use(UsersRouter);
    this.server.use(AuthRouter);
  }

  private listeners(): void {
    this.server.use(errors.notFound);
    this.server.use(errors.exception);
  }
}

export default new App().server;
