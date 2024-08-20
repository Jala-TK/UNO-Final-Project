import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Player from './player.js';

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
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: 'id',
    },
  },
  clockwise: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  cardsToBuy: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  currentPlayer: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Player,
      key: 'id',
    },
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default Game;
