import { Curso, Leccion, Inscripcion } from '../models/index.js';
import AppError from '../errors/AppError.js';

export const listarCursosInstructor = async (instructorId) => {
  return await Curso.findAll({
    where: { instructorId },
    include: [{ model: Leccion, as: 'lecciones', attributes: ['id', 'titulo', 'tipo', 'orden'] }],
    order: [['creadoEn', 'DESC']],
  });
};

export const crearCurso = async (instructorId, datos) => {
  return await Curso.create({
    ...datos,
    instructorId,
    estado: 'borrador',
  });
};

export const actualizarCurso = async (curso, datos) => {
  return await curso.update(datos);
};

export const cambiarEstadoCurso = async (curso, nuevoEstado) => {
  // Regla RN-05: no se puede publicar un curso sin lecciones
  if (nuevoEstado === 'publicado') {
    const cantidadLecciones = await Leccion.count({ where: { cursoId: curso.id } });
    if (cantidadLecciones === 0) {
      throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'No se puede publicar un curso sin al menos una lección');
    }
  }

  return await curso.update({ estado: nuevoEstado });
};

export const eliminarCurso = async (curso) => {
  // Regla RN-06: un curso con inscritos no se elimina, solo se archiva
  const cantidadInscritos = await Inscripcion.count({ where: { cursoId: curso.id } });
  if (cantidadInscritos > 0) {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Un curso con estudiantes inscritos no se puede eliminar, solo archivar');
  }

  await curso.destroy();
};
