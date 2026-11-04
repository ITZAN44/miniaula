import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Progreso = sequelize.define(
  'Progreso',
  {
    inscripcionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    intentos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    mejorNota: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'progresos',
    createdAt: false,
    updatedAt: 'actualizadoEn',
  },
);

export default Progreso;
