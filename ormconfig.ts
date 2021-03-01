import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require('dotenv').config();

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;

export const config: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: 'username',
  password: 'password',
  database: 'database',
  synchronize: false,
  entities: [
    "src/model/*.entity.ts"
  ],
  subscribers: [
    "src/**.module/*-subscriber.ts"
  ],
  migrations: [
    "src/migration/*.ts"
  ],
  cli: {
    migrationsDir: 'src/migration',
  }
};