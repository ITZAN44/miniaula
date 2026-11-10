import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Leccion = sequelize.define(
  'Leccion',
  {
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('contenido', 'cuestionario'),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notaMinima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'lecciones',
    timestamps: false,
  },
);

export default Leccion;
