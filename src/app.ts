import Server from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import ErrorMiddleware from './middlewares/error';

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
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(bodyParser.json());
    this.server.use(ErrorMiddleware.notFoundHandler());
    this.server.use(ErrorMiddleware.exceptionHandler());
  }

  private routes(): void {
    // this.server.use(routes);
  }
}

export default new App().server;
