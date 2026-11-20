import { Curso, Inscripcion, Usuario } from '../models/index.js';
import AppError from '../errors/AppError.js';
import { estadoDelCurso } from './progreso.service.js';

export const inscribir = async (estudianteId, cursoId) => {
  const curso = await Curso.findOne({ where: { id: cursoId, estado: 'publicado' } });
  if (!curso) {
    throw new AppError(404, 'NOT_FOUND', 'El curso no existe o no está publicado');
  }

  const existente = await Inscripcion.findOne({ where: { estudianteId, cursoId } });
  if (existente) {
    throw new AppError(409, 'CONFLICT', 'Ya estás inscrito en este curso');
  }

  return await Inscripcion.create({ estudianteId, cursoId });
};

export const listarMisInscripciones = async (estudianteId) => {
  const inscripciones = await Inscripcion.findAll({
    where: { estudianteId },
    include: [
      {
        model: Curso,
        as: 'curso',
        attributes: ['id', 'titulo', 'categoria', 'nivel', 'estado'],
        include: [{ model: Usuario, as: 'instructor', attributes: ['id', 'nombre'] }],
      },
    ],
    order: [['fechaInscripcion', 'DESC']],
  });

  return await Promise.all(
    inscripciones.map(async (inscripcion) => {
      const { completadas, total, porcentaje } = await estadoDelCurso(inscripcion);
      return { ...inscripcion.toJSON(), completadas, total, porcentaje };
    }),
  );
};
