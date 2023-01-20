import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Carruzel = sequelize.define(
  'carruzel',
  {
    carruzel_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carruzel_img: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);
export default Carruzel;
