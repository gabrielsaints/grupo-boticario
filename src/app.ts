import Server from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import './config/env';

const { log } = console;

interface IApp {
  server: Server.Express;
}

class App implements IApp {
  public server: Server.Express;

  constructor() {
    this.server = Server();

    this.middlewares();
    this.routes();
    this.greeting();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(bodyParser.json());
  }

  private routes(): void {
    // this.server.use(routes);
  }

  private greeting(): void {
    log(`Listening port ${process.env.PORT}`);
  }
}

export default new App().server;
