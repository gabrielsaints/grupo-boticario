// tslint:disable-next-line: no-namespace
declare namespace Express {
  // tslint:disable-next-line: interface-name
  export interface Request {
    user?: import('./models/user').IUserModel;
    sale?: import('./models/sale').ISaleModel;
  }
}
