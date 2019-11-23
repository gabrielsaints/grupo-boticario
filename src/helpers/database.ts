import mongoose from 'mongoose';

abstract class Database {
  public static async connect() {
    try {
      if (!Database.getUri()) {
        throw new Error('env variable `MONGO_URI` cannot be empty or null');
      }

      const uri: string = Database.getUri() as string;

      await mongoose.connect(uri, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      return true;
    } catch (err) {
      throw err;
    }
  }

  public static async disconnect() {
    await mongoose.disconnect();
  }

  private static getUri(): string | undefined {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      return uri;
    }

    if (process.env.NODE_ENV === 'test') {
      uri += '-test';
    }

    return uri;
  }
}

export default Database;
