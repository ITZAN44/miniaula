import cliente from './cliente.js';

export const listarCatalogo = (filtros) =>
  cliente.get('/cursos', { params: filtros }).then((respuesta) => respuesta.data);

export const listarCategorias = () =>
  cliente.get('/cursos/categorias').then((respuesta) => respuesta.data);

export const obtenerCurso = (id) =>
  cliente.get(`/cursos/${id}`).then((respuesta) => respuesta.data);

export const inscribirse = (cursoId) =>
  cliente.post(`/cursos/${cursoId}/inscripcion`).then((respuesta) => respuesta.data);

export const listarMisInscripciones = () =>
  cliente.get('/inscripciones/mias').then((respuesta) => respuesta.data);

export const obtenerProgreso = (cursoId) =>
  cliente.get(`/cursos/${cursoId}/progreso`).then((respuesta) => respuesta.data);

export const obtenerLeccion = (id) =>
  cliente.get(`/lecciones/${id}`).then((respuesta) => respuesta.data);

export const completarLeccion = (id) =>
  cliente.post(`/lecciones/${id}/completar`).then((respuesta) => respuesta.data);

export const rendirCuestionario = (id, respuestas) =>
  cliente.post(`/lecciones/${id}/intentos`, { respuestas }).then((respuesta) => respuesta.data);
