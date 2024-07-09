import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Game from './game.js';

const Card = sequelize.define('Card', {
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    references: {
      model: Game,
      key: 'id'
    },
    allowNull: false,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
});

export default Card;