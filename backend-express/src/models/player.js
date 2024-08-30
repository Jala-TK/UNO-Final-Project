import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Player = sequelize.define('Player', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  wins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default Player;
