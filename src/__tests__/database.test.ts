import Database from '../helpers/database';

describe('Database', () => {
  afterEach(async () => {
    await Database.disconnect();
  });
  test('`database` shouLd connect and disconnect to mongodb without errors', async () => {
    expect.assertions(1);
    const response = await Database.connect();
    expect(response).toBe(true);
  });

  test("`database` should return error if doens't exists any MONGO_URI environment variable", async () => {
    expect.assertions(2);
    try {
      await Database.connect(null);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain('MONGO_URI');
    }
  });
});
