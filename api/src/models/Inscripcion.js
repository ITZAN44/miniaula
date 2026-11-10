import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Inscripcion = sequelize.define(
  'Inscripcion',
  {
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'inscripciones',
    createdAt: 'fechaInscripcion',
    updatedAt: false,
  },
);

export default Inscripcion;
