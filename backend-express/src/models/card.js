import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Game from "./game.js";
import Player from "./player.js";

const Card = sequelize.define("Card", {
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    references: {
      model: Game,
      key: "id",
    },
    allowNull: false,
  },
  whoOwnerCard: {
    type: DataTypes.INTEGER,
    references: {
      model: Player,
      key: "id",
    },
    allowNull: true,
  },
  orderDiscarded: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    allowNull: true,
  },
  auditExcluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default Card;
