import { Sequelize } from 'sequelize';
import configuracion from './database.cjs';

const entorno = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(configuracion[entorno]);

export default sequelize;
