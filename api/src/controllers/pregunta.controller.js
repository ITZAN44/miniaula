import * as preguntaService from '../services/pregunta.service.js';

// Lista las preguntas de un cuestionario para el instructor
export const listarPreguntasDeLeccion = async (req, res) => {
  const preguntas = await preguntaService.listarPreguntasDeLeccion(req.leccion.id);
  res.json(preguntas);
};

// Crea una pregunta para un cuestionario
export const crearPregunta = async (req, res) => {
  const nuevaPregunta = await preguntaService.crearPregunta(req.leccion, req.body);
  res.status(201).json(nuevaPregunta);
};

// Modifica una pregunta existente
export const actualizarPregunta = async (req, res) => {
  const preguntaActualizada = await preguntaService.actualizarPregunta(req.pregunta, req.body);
  res.json(preguntaActualizada);
};

// Elimina una pregunta
export const eliminarPregunta = async (req, res) => {
  await preguntaService.eliminarPregunta(req.pregunta);
  res.status(204).send();
};
