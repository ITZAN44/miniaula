import * as cursoService from '../services/curso.service.js';

export const listarCursosInstructor = async (req, res) => {
  const cursos = await cursoService.listarCursosInstructor(req.usuario.id);
  res.json(cursos);
};

export const crearCurso = async (req, res) => {
  const curso = await cursoService.crearCurso(req.usuario.id, req.body);
  res.status(201).json(curso);
};

export const actualizarCurso = async (req, res) => {
  const cursoActualizado = await cursoService.actualizarCurso(req.curso, req.body);
  res.json(cursoActualizado);
};

export const cambiarEstadoCurso = async (req, res) => {
  const cursoActualizado = await cursoService.cambiarEstadoCurso(req.curso, req.body.estado);
  res.json(cursoActualizado);
};

export const eliminarCurso = async (req, res) => {
  await cursoService.eliminarCurso(req.curso);
  res.status(204).send();
};
