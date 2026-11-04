import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Curso = sequelize.define(
  'Curso',
  {
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nivel: {
      type: DataTypes.ENUM('basico', 'intermedio', 'avanzado'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('borrador', 'publicado', 'archivado'),
      allowNull: false,
      defaultValue: 'borrador',
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'cursos',
    createdAt: 'creadoEn',
    updatedAt: false,
  },
);

export default Curso;
