import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tracking = sequelize.define('Tracking', {
  endpointAccess: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  responseTimeAvg: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  responseTimeMin: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  responseTimeMax: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Tracking;
