import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('unoDB', 'sa', 'P@ssw0rd123', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

export default sequelize;
