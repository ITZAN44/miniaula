import * as cursoService from '../services/curso.service.js';

// Lista los cursos creados por el instructor autenticado
export const listarCursosInstructor = async (req, res) => {
  const cursos = await cursoService.listarCursosInstructor(req.usuario.id);
  res.json(cursos);
};

// Registra un nuevo curso en estado borrador
export const crearCurso = async (req, res) => {
  const curso = await cursoService.crearCurso(req.usuario.id, req.body);
  res.status(201).json(curso);
};

// Modifica los datos de un curso
export const actualizarCurso = async (req, res) => {
  const cursoActualizado = await cursoService.actualizarCurso(req.curso, req.body);
  res.json(cursoActualizado);
};

// Publica o archiva un curso
export const cambiarEstadoCurso = async (req, res) => {
  const cursoActualizado = await cursoService.cambiarEstadoCurso(req.curso, req.body.estado);
  res.json(cursoActualizado);
};

// Elimina un curso sin estudiantes
export const eliminarCurso = async (req, res) => {
  await cursoService.eliminarCurso(req.curso);
  res.status(204).send();
};
