import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: isProduction
    ? [path.join(__dirname, '../**/*.entity.js')]
    : ['src/**/*.entity.ts'],
  migrations: isProduction
    ? [path.join(__dirname, 'migrations/*.js')]
    : ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
