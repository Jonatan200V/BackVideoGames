import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';
import Categories from './Categorias.model.js';
import Platforms from './Platforms.model.js';
import User from './User.model.js';
import Factura from './Factura.model.js';
import Order from './Order.model.js';
import Reviews from './Posts.model.js';
const Games = sequelize.define(
  'games',
  {
    games_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    games_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    games_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    games_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    games_background_image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    games_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    games_minimun: {
      type: DataTypes.TEXT,
    },
    games_maximun: {
      type: DataTypes.TEXT,
    },
    games_price: {
      type: DataTypes.INTEGER,
    },
    games_in_ofert: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    games_genres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    games_platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    games_suspense: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: false }
);
const GameCategory = sequelize.define(
  'game_category',
  {},
  { timestamps: false }
);
Games.belongsToMany(Categories, {
  through: GameCategory,
  foreignKey: 'games_id',
});
Categories.belongsToMany(Games, {
  through: GameCategory,
  foreignKey: 'category_id',
});
Games.belongsToMany(Platforms, { through: 'games_platforms' });
Platforms.belongsToMany(Games, { through: 'games_platforms' });
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Factura);
Factura.belongsTo(User);
Order.hasOne(Factura);
Factura.belongsTo(Order);
// Games.hasMany(Factura)
// Factura.belongsTo(Games)
Games.hasMany(Reviews);
Reviews.belongsTo(Games);
User.hasMany(Reviews);
Reviews.belongsTo(User);
export default Games;
