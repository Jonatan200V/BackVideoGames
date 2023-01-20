import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const { PASSWORD, HOSTPG, PORTPG, DBPG } = process.env;
const sequelize = new Sequelize(
  `postgres://postgres:${PASSWORD}@${HOSTPG}:${PORTPG}/${DBPG}`,
  {
    logging: false,
    native: false,
  }
);

export default sequelize;
