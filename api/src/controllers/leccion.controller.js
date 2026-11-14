import * as leccionService from '../services/leccion.service.js';

export const crearLeccion = async (req, res) => {
  const nuevaLeccion = await leccionService.crearLeccion(req.curso.id, req.body);
  res.status(201).json(nuevaLeccion);
};

export const actualizarLeccion = async (req, res) => {
  const leccionActualizada = await leccionService.actualizarLeccion(req.leccion, req.body);
  res.json(leccionActualizada);
};

export const eliminarLeccion = async (req, res) => {
  await leccionService.eliminarLeccion(req.leccion);
  res.status(204).send();
};

export const reordenarLecciones = async (req, res) => {
  const leccionesOrdenadas = await leccionService.reordenarLecciones(req.curso.id, req.body.orden);
  res.json(leccionesOrdenadas);
};
