import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const BlacklistToken = sequelize.define('BlacklistToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default BlacklistToken;
