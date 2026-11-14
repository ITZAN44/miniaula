import * as preguntaService from '../services/pregunta.service.js';

export const listarPreguntasDeLeccion = async (req, res) => {
  const preguntas = await preguntaService.listarPreguntasDeLeccion(req.leccion.id);
  res.json(preguntas);
};

export const crearPregunta = async (req, res) => {
  const nuevaPregunta = await preguntaService.crearPregunta(req.leccion, req.body);
  res.status(201).json(nuevaPregunta);
};

export const actualizarPregunta = async (req, res) => {
  const preguntaActualizada = await preguntaService.actualizarPregunta(req.pregunta, req.body);
  res.json(preguntaActualizada);
};

export const eliminarPregunta = async (req, res) => {
  await preguntaService.eliminarPregunta(req.pregunta);
  res.status(204).send();
};
