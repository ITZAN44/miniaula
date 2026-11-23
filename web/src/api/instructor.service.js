import cliente from './cliente.js';

export const listarMisCursos = () =>
  cliente.get('/instructor/cursos').then((respuesta) => respuesta.data);

export const crearCurso = (datos) =>
  cliente.post('/cursos', datos).then((respuesta) => respuesta.data);

export const actualizarCurso = (id, datos) =>
  cliente.put(`/cursos/${id}`, datos).then((respuesta) => respuesta.data);

export const cambiarEstadoCurso = (id, estado) =>
  cliente.patch(`/cursos/${id}/estado`, { estado }).then((respuesta) => respuesta.data);

export const eliminarCurso = (id) =>
  cliente.delete(`/cursos/${id}`);

export const crearLeccion = (cursoId, datos) =>
  cliente.post(`/cursos/${cursoId}/lecciones`, datos).then((respuesta) => respuesta.data);

export const actualizarLeccion = (id, datos) =>
  cliente.put(`/lecciones/${id}`, datos).then((respuesta) => respuesta.data);

export const eliminarLeccion = (id) =>
  cliente.delete(`/lecciones/${id}`);

export const reordenarLecciones = (cursoId, orden) =>
  cliente.patch(`/cursos/${cursoId}/lecciones/orden`, { orden }).then((respuesta) => respuesta.data);

export const listarPreguntas = (leccionId) =>
  cliente.get(`/lecciones/${leccionId}/preguntas`).then((respuesta) => respuesta.data);

export const crearPregunta = (leccionId, datos) =>
  cliente.post(`/lecciones/${leccionId}/preguntas`, datos).then((respuesta) => respuesta.data);

export const actualizarPregunta = (id, datos) =>
  cliente.put(`/preguntas/${id}`, datos).then((respuesta) => respuesta.data);

export const eliminarPregunta = (id) =>
  cliente.delete(`/preguntas/${id}`);
