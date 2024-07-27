import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    options: {
      encrypt: process.env.DB_DIALECT == true
    }
  }
});

export default sequelize;
