import 'dotenv/config';

const connection = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_DATABASE,
      options: {
        encrypt: !!process.env.DB_ENCRYPT,
      },
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT!, 10),
      server: process.env.DB_SERVER,
      user: process.env.DB_USER,
    },
    migrations: {
      tableName: 'knexMigrations',
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX!, 10),
      min: parseInt(process.env.DB_POOL_MIN!, 10),
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: process.env.DB_DATABASE + '_test',
      options: {
        encrypt: !!process.env.DB_ENCRYPT,
      },
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT!, 10),
      server: process.env.DB_SERVER,
      user: process.env.DB_USER,
    },
    migrations: {
      tableName: 'knexMigrations',
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX!, 10),
      min: parseInt(process.env.DB_POOL_MIN!, 10),
    },
  },
};

module.exports = connection;

export default connection as any;
