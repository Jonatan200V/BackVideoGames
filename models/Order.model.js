import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Order = sequelize.define(
  'orders',
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_status: {
      type: DataTypes.ENUM('pagado', 'despachado', 'entregado'),
    },
  },
  { timestamps: false }
);

export default Order;
