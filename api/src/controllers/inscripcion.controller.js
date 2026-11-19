import * as inscripcionService from '../services/inscripcion.service.js';

export const inscribir = async (req, res) => {
  const inscripcion = await inscripcionService.inscribir(req.usuario.id, req.params.id);
  res.status(201).json(inscripcion);
};

export const listarMisInscripciones = async (req, res) => {
  const inscripciones = await inscripcionService.listarMisInscripciones(req.usuario.id);
  res.json(inscripciones);
};
