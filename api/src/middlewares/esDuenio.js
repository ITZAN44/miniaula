import { Curso, Leccion, Pregunta } from '../models/index.js';
import AppError from '../errors/AppError.js';

export const esDuenioCurso = async (req, res, next) => {
  const cursoId = req.params.cursoId || req.params.id;
  const curso = await Curso.findByPk(cursoId);

  if (!curso) {
    return next(new AppError(404, 'NOT_FOUND', 'El curso no existe'));
  }

  // Regla RN-07: el instructor solo puede modificar sus propios recursos
  if (curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No eres el instructor de este curso'));
  }

  req.curso = curso;
  next();
};

export const esDuenioLeccion = async (req, res, next) => {
  const leccion = await Leccion.findByPk(req.params.id, {
    include: [{ model: Curso, as: 'curso' }],
  });

  if (!leccion) {
    return next(new AppError(404, 'NOT_FOUND', 'La lección no existe'));
  }

  if (leccion.curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No tienes permiso sobre esta lección'));
  }

  req.leccion = leccion;
  next();
};

export const esDuenioPregunta = async (req, res, next) => {
  const pregunta = await Pregunta.scope('conRespuesta').findByPk(req.params.id, {
    include: [
      {
        model: Leccion,
        as: 'leccion',
        include: [{ model: Curso, as: 'curso' }],
      },
    ],
  });

  if (!pregunta) {
    return next(new AppError(404, 'NOT_FOUND', 'La pregunta no existe'));
  }

  if (pregunta.leccion.curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No tienes permiso sobre esta pregunta'));
  }

  req.pregunta = pregunta;
  next();
};
