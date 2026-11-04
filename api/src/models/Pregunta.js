import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Pregunta = sequelize.define(
  'Pregunta',
  {
    enunciado: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    opciones: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    indiceCorrecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'preguntas',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['indiceCorrecto'] },
    },
    scopes: {
      conRespuesta: {},
    },
  },
);

export default Pregunta;
