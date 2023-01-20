import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Platforms = sequelize.define(
  'platforms',
  {
    platform_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    platform_name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default Platforms;
