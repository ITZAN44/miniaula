import { Curso, Leccion, Inscripcion, Progreso } from '../models/index.js';
import AppError from '../errors/AppError.js';
import { estadoDelCurso } from './progreso.service.js';

export const listarCursosInstructor = async (instructorId) => {
  return await Curso.findAll({
    where: { instructorId },
    include: [{ model: Leccion, as: 'lecciones' }],
    order: [
      ['creadoEn', 'DESC'],
      [{ model: Leccion, as: 'lecciones' }, 'orden', 'ASC'],
    ],
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

export const obtenerResumenCurso = async (curso) => {
  const lecciones = await Leccion.findAll({
    where: { cursoId: curso.id },
    order: [['orden', 'ASC']],
  });

  const inscripciones = await Inscripcion.findAll({
    where: { cursoId: curso.id },
  });

  const totalInscritos = inscripciones.length;

  if (totalInscritos === 0) {
    return {
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        categoria: curso.categoria,
        nivel: curso.nivel,
        estado: curso.estado,
      },
      inscritos: 0,
      progresoPromedio: 0,
      notaPromedio: null,
      leccionDondeSeDetienen: null,
      lecciones: lecciones.map((leccion) => ({
        id: leccion.id,
        titulo: leccion.titulo,
        tipo: leccion.tipo,
        orden: leccion.orden,
        completados: 0,
        detenidos: 0,
      })),
    };
  }

  const estados = await Promise.all(inscripciones.map((inscripcion) => estadoDelCurso(inscripcion)));

  const sumaPorcentajes = estados.reduce((acumulado, estado) => acumulado + estado.porcentaje, 0);
  const progresoPromedio = Math.round(sumaPorcentajes / totalInscritos);

  const progresos = await Progreso.findAll({
    where: {
      inscripcionId: inscripciones.map((i) => i.id),
    },
  });

  const notas = progresos
    .map((p) => p.mejorNota)
    .filter((nota) => nota !== null && nota !== undefined);

  const notaPromedio =
    notas.length > 0 ? Math.round(notas.reduce((acumulado, nota) => acumulado + nota, 0) / notas.length) : null;

  const conteoCompletados = new Map();
  const conteoDetenidos = new Map();

  for (const estado of estados) {
    for (const leccion of estado.lecciones) {
      if (leccion.completada) {
        conteoCompletados.set(leccion.id, (conteoCompletados.get(leccion.id) || 0) + 1);
      }
    }

    if (estado.porcentaje < 100) {
      const leccionDetenida = estado.lecciones.find((leccion) => !leccion.completada);
      if (leccionDetenida) {
        conteoDetenidos.set(leccionDetenida.id, (conteoDetenidos.get(leccionDetenida.id) || 0) + 1);
      }
    }
  }

  let leccionTop = null;
  let maxDetenidos = 0;

  for (const leccion of lecciones) {
    const detenidos = conteoDetenidos.get(leccion.id) || 0;
    if (detenidos > maxDetenidos) {
      maxDetenidos = detenidos;
      leccionTop = leccion;
    }
  }

  return {
    curso: {
      id: curso.id,
      titulo: curso.titulo,
      categoria: curso.categoria,
      nivel: curso.nivel,
      estado: curso.estado,
    },
    inscritos: totalInscritos,
    progresoPromedio,
    notaPromedio,
    leccionDondeSeDetienen: leccionTop
      ? {
          id: leccionTop.id,
          titulo: leccionTop.titulo,
          orden: leccionTop.orden,
          tipo: leccionTop.tipo,
          estudiantesDetenidos: maxDetenidos,
        }
      : null,
    lecciones: lecciones.map((leccion) => ({
      id: leccion.id,
      titulo: leccion.titulo,
      tipo: leccion.tipo,
      orden: leccion.orden,
      completados: conteoCompletados.get(leccion.id) || 0,
      detenidos: conteoDetenidos.get(leccion.id) || 0,
    })),
  };
};
