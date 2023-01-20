import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Notification = sequelize.define(
  'notification',
  {
    notification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    notification_image: {
      type: DataTypes.TEXT,
    },
    notification_title: {
      type: DataTypes.STRING,
    },
    notification_description: {
      type: DataTypes.TEXT,
    },
    notification_view: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Notification;
