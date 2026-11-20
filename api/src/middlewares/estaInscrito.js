import { Inscripcion, Leccion } from '../models/index.js';
import AppError from '../errors/AppError.js';

const buscarInscripcion = (estudianteId, cursoId) => Inscripcion.findOne({ where: { estudianteId, cursoId } });

export const inscritoEnCurso = async (req, res, next) => {
  const inscripcion = await buscarInscripcion(req.usuario.id, req.params.id);

  if (!inscripcion) {
    return next(new AppError(403, 'FORBIDDEN', 'Debes estar inscrito en el curso'));
  }

  req.inscripcion = inscripcion;
  next();
};

export const inscritoEnLeccion = async (req, res, next) => {
  const leccion = await Leccion.findByPk(req.params.id);

  if (!leccion) {
    return next(new AppError(404, 'NOT_FOUND', 'La lección no existe'));
  }

  const inscripcion = await buscarInscripcion(req.usuario.id, leccion.cursoId);

  if (!inscripcion) {
    return next(new AppError(403, 'FORBIDDEN', 'Debes estar inscrito en el curso de esta lección'));
  }

  req.leccion = leccion;
  req.inscripcion = inscripcion;
  next();
};
