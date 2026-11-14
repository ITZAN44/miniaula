import { Pregunta } from '../models/index.js';
import AppError from '../errors/AppError.js';

// Lista las preguntas de un cuestionario con su respuesta correcta para el editor del instructor
export const listarPreguntasDeLeccion = async (leccionId) => {
  return await Pregunta.scope('conRespuesta').findAll({
    where: { leccionId },
  });
};

// Registra una nueva pregunta asociada a una leccion de tipo cuestionario
export const crearPregunta = async (leccion, datos) => {
  // Validamos que la leccion realmente sea de tipo cuestionario
  if (leccion.tipo !== 'cuestionario') {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Solo se pueden agregar preguntas a lecciones de tipo cuestionario');
  }

  // Creamos la pregunta y la retornamos incluyendo la respuesta correcta para el instructor
  const pregunta = await Pregunta.create({
    ...datos,
    leccionId: leccion.id,
  });

  return await Pregunta.scope('conRespuesta').findByPk(pregunta.id);
};

// Modifica una pregunta existente
export const actualizarPregunta = async (pregunta, datos) => {
  await pregunta.update(datos);
  return await Pregunta.scope('conRespuesta').findByPk(pregunta.id);
};

// Elimina una pregunta de la base de datos
export const eliminarPregunta = async (pregunta) => {
  await pregunta.destroy();
};
