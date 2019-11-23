import mongoose from 'mongoose';

abstract class Database {
  public static async connect(
    uri: string | null | undefined = process.env.MONGO_URI,
  ) {
    try {
      if (!Database.getUri(uri)) {
        throw new Error('env variable `MONGO_URI` cannot be empty or null');
      }

      const uriFormated: string = Database.getUri(uri) as string;

      await mongoose.connect(uriFormated, {
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

  private static getUri(
    uri: string | null | undefined,
  ): string | undefined | null {
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
