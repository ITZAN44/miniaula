import { Pregunta } from '../models/index.js';
import AppError from '../errors/AppError.js';

export const listarPreguntasDeLeccion = async (leccionId) => {
  return await Pregunta.scope('conRespuesta').findAll({
    where: { leccionId },
  });
};

export const crearPregunta = async (leccion, datos) => {
  if (leccion.tipo !== 'cuestionario') {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Solo se pueden agregar preguntas a lecciones de tipo cuestionario');
  }

  const pregunta = await Pregunta.create({
    ...datos,
    leccionId: leccion.id,
  });

  return await Pregunta.scope('conRespuesta').findByPk(pregunta.id);
};

export const actualizarPregunta = async (pregunta, datos) => {
  const opcionesFinales = datos.opciones || pregunta.opciones;
  const nuevoIndice = datos.indiceCorrecto !== undefined ? datos.indiceCorrecto : pregunta.indiceCorrecto;

  if (nuevoIndice >= opcionesFinales.length) {
    throw new AppError(400, 'VALIDATION_ERROR', 'El índice correcto no corresponde a ninguna opción');
  }

  await pregunta.update(datos);
  return await Pregunta.scope('conRespuesta').findByPk(pregunta.id);
};

export const eliminarPregunta = async (pregunta) => {
  await pregunta.destroy();
};
