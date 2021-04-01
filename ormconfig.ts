import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require('dotenv').config();

const { DB_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, DB_HOST } = process.env;
console.log (__dirname )
export const config: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  logging: process.env.NODE_ENV == 'production' ? ['error'] : ['query', 'error'],
  entities: [
    __dirname + "/src/_MODEL/*.entity{.ts,.js}"
  ],
  subscribers: [
    __dirname + '/src/subscribers/**/*{.ts,.js}'
  ],
  migrations: [
    __dirname + '/src/migration/*{.ts,.js}'
  ],
  cli: {
    migrationsDir: 'src/migration/',
  }
};