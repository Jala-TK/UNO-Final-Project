import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Game = sequelize.define('Game', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },

});


export default Game;
