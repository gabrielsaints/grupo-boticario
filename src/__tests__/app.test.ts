import chance from './utils/chance';
import request from './utils/request';
import Database from '../helpers/database';

describe('Application', () => {
  test('`app` should load without errors', async () => {
    expect.assertions(1);
    const response = await request().options('/');
    expect(response.status).toBe(204);
  });

  test('`app` should allow cors', async () => {
    expect.assertions(1);
    const response = await request().options('/');
    expect(response.header['access-control-allow-origin']).toBe('*');
  });

  test('`app` should return `404` if any route has been not found', async () => {
    expect.assertions(1);
    const response = await request().head(`/${chance.string()}`);
    expect(response.status).toBe(404);
  });

  describe('Database', () => {
    let oldEnv: string | undefined;
    beforeEach(() => {
      oldEnv = process.env.MONGO_URI;
      delete process.env.MONGO_URI;
    });

    afterEach(() => {
      process.env.MONGO_URI = oldEnv;
    });

    test('`database` shound connect and disconnect to mongodb without errors', async () => {
      expect.assertions(2);
      process.env.MONGO_URI = oldEnv;
      const response = await Database.connect();
      expect(response).toBe(true);
      await Database.disconnect();
      expect(true).toBe(true);
    });

    test("`database` should return error if doens't exists any MONGO_URI environment variable", async () => {
      expect.assertions(2);
      try {
        await Database.connect();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toContain('MONGO_URI');
      }
    });
  });
});
