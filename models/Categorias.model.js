import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Categories = sequelize.define(
  'category',
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Categories;
