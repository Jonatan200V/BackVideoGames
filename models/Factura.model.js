import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Factura = sequelize.define(
  'facturas',
  {
    factura_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    factura_total: {
      type: DataTypes.INTEGER,
    },
    factura_description: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: false }
);

export default Factura;
