import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Player from '../models/player.js';
import Game from '../models/game.js';

const GamePlayer = sequelize.define('GamePlayer', {
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
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  uno: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  score: {
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

export default GamePlayer;
