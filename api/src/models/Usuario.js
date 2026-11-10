import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Usuario = sequelize.define(
  'Usuario',
  {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('estudiante', 'instructor'),
      allowNull: false,
    },
  },
  {
    tableName: 'usuarios',
    createdAt: 'creadoEn',
    updatedAt: false,
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      conPassword: {},
    },
  },
);

export default Usuario;
