import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_DIALECT === 'mssql' ? true : false,
      },
    },
  }
);

export default sequelize;
