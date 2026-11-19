import * as progresoService from '../services/progreso.service.js';

export const obtenerProgreso = async (req, res) => {
  const progreso = await progresoService.obtenerProgreso(req.inscripcion);
  res.json(progreso);
};

export const obtenerLeccion = async (req, res) => {
  const leccion = await progresoService.obtenerLeccion(req.inscripcion, req.leccion);
  res.json(leccion);
};

export const completarLeccion = async (req, res) => {
  const progreso = await progresoService.completarLeccion(req.inscripcion, req.leccion);
  res.json(progreso);
};
