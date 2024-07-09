import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Player from './player.js';
import Game from './game.js';

const Score = sequelize.define('Score', {
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: 'id',
    },
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
});

export default Score;