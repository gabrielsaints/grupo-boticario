// tslint:disable-next-line: no-namespace
declare namespace Express {
  // tslint:disable-next-line: interface-name
  export interface Request {
    user?: import('./models/user').default;
    sale?: import('./models/sale').default;
  }
}
