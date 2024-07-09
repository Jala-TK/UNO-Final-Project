import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Player = sequelize.define('Player', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
});

export default Player;
