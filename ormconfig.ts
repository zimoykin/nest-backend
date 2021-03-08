import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require('dotenv').config();

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;
console.log (__dirname )
export const config: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  entities: [
    __dirname + "/src/model/*.entity{.ts,.js}"
  ],
  subscribers: [
    __dirname + '/src/subscribers/**/*{.ts,.js}'
  ],
  migrations: [
    __dirname + '/src/migration/*{.ts,.js}'
  ],
  cli: {
    migrationsDir: '../migration',
  }
};