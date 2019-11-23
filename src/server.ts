import app from './app';
import Database from './helpers/database';

(async () => {
  await Database.connect();
  app.listen(process.env.PORT);
})();
