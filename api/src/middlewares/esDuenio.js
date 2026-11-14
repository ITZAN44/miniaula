import { Curso, Leccion, Pregunta } from '../models/index.js';
import AppError from '../errors/AppError.js';

// Verifica que el usuario autenticado sea el instructor dueño del curso
export const esDuenioCurso = async (req, res, next) => {
  // El id del curso puede venir como :id o como :cursoId
  const cursoId = req.params.cursoId || req.params.id;

  const curso = await Curso.findByPk(cursoId);

  if (!curso) {
    return next(new AppError(404, 'NOT_FOUND', 'El curso no existe'));
  }

  // Comparamos el instructorId del curso con el id del token
  if (curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No eres el instructor de este curso'));
  }

  // Dejamos el curso disponible en la peticion para los siguientes pasos
  req.curso = curso;
  next();
};

// Verifica que el usuario sea el dueño del curso al que pertenece la leccion
export const esDuenioLeccion = async (req, res, next) => {
  const leccionId = req.params.id;

  const leccion = await Leccion.findByPk(leccionId, {
    include: [{ model: Curso, as: 'curso' }],
  });

  if (!leccion) {
    return next(new AppError(404, 'NOT_FOUND', 'La lección no existe'));
  }

  // Revisamos si el instructor del curso es quien hace la peticion
  if (leccion.curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No tienes permiso sobre esta lección'));
  }

  req.leccion = leccion;
  next();
};

// Verifica que el usuario sea el dueño del curso al que pertenece la pregunta
export const esDuenioPregunta = async (req, res, next) => {
  const preguntaId = req.params.id;

  const pregunta = await Pregunta.findByPk(preguntaId, {
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

  // Verificamos propiedad subiendo por la relacion leccion -> curso
  if (pregunta.leccion.curso.instructorId !== req.usuario.id) {
    return next(new AppError(403, 'FORBIDDEN', 'No tienes permiso sobre esta pregunta'));
  }

  req.pregunta = pregunta;
  next();
};
