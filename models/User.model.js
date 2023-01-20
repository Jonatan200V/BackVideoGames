import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const User = sequelize.define(
  'users',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    user_province: {
      type: DataTypes.STRING,
    },
    user_city: {
      type: DataTypes.STRING,
    },
    user_code: {
      type: DataTypes.INTEGER,
    },
    user_surname: {
      type: DataTypes.STRING,
    },
    user_user: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_profile: {
      type: DataTypes.STRING,
    },
    user_payment: {
      type: DataTypes.ENUM('credito'),
    },
    user_phone: {
      type: DataTypes.STRING,
    },
    user_suspense: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export default User;
