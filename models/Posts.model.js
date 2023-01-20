import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Reviews = sequelize.define(
  'review',
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    review_content: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);
export default Reviews;
