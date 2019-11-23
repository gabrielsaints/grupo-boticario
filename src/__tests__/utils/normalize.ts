import Database from '../../helpers/database';

abstract class Normalize {
  public static async beforeAll() {
    await Database.connect();
  }

  public static async afterAll() {
    await Database.disconnect();
  }
}

export default Normalize;
