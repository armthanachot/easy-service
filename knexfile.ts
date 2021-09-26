import { MYSQL } from "./databases/env/production";

export default {
  development: {
    client: 'mysql',
    connection: {
      host: MYSQL.host,
      user: MYSQL.user,
      password: MYSQL.password,
      database: MYSQL.database
    },
    migrations: {
      tableName: 'migrations',
      directory: __dirname + '/databases/migrations'
    },
    seeds: {
      tableName: 'seeds',
      directory: __dirname + '/databases/seeds'
    }
  },
};
