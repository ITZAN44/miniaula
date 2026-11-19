import { Curso, Leccion, Pregunta, Progreso } from '../models/index.js';
import AppError from '../errors/AppError.js';

// Una lección queda bloqueada mientras alguna de las anteriores no esté completada
export const estadoDelCurso = async (inscripcion) => {
  const lecciones = await Leccion.findAll({
    where: { cursoId: inscripcion.cursoId },
    attributes: ['id', 'titulo', 'tipo', 'orden', 'notaMinima'],
    order: [['orden', 'ASC']],
  });
  const progresos = await Progreso.findAll({ where: { inscripcionId: inscripcion.id } });
  const progresoPorLeccion = new Map(progresos.map((progreso) => [progreso.leccionId, progreso]));

  let anterioresCompletadas = true;
  const estado = lecciones.map((leccion) => {
    const progreso = progresoPorLeccion.get(leccion.id);
    const completada = Boolean(progreso?.completada);
    const bloqueada = !anterioresCompletadas;
    anterioresCompletadas = anterioresCompletadas && completada;

    return {
      ...leccion.toJSON(),
      completada,
      bloqueada,
      intentos: progreso?.intentos ?? 0,
      mejorNota: progreso?.mejorNota ?? null,
    };
  });

  const completadas = estado.filter((leccion) => leccion.completada).length;
  const total = estado.length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas * 100) / total);

  return { lecciones: estado, completadas, total, porcentaje };
};

const verificarDesbloqueada = async (inscripcion, leccionId) => {
  const { lecciones } = await estadoDelCurso(inscripcion);
  const estado = lecciones.find((leccion) => leccion.id === leccionId);

  if (estado.bloqueada) {
    throw new AppError(403, 'LECCION_BLOQUEADA', 'Completa las lecciones anteriores para abrir esta');
  }

  return estado;
};

const actualizarCompletado = async (inscripcion) => {
  const { porcentaje } = await estadoDelCurso(inscripcion);
  await inscripcion.update({ completado: porcentaje === 100 });
};

export const obtenerProgreso = async (inscripcion) => {
  const curso = await Curso.findByPk(inscripcion.cursoId, { attributes: ['id', 'titulo', 'estado'] });
  const estado = await estadoDelCurso(inscripcion);
  return { curso, ...estado };
};

export const obtenerLeccion = async (inscripcion, leccion) => {
  const { completada, intentos, mejorNota } = await verificarDesbloqueada(inscripcion, leccion.id);
  const datos = { ...leccion.toJSON(), completada, intentos, mejorNota };

  if (leccion.tipo === 'cuestionario') {
    // El scope por defecto de Pregunta deja afuera indiceCorrecto
    datos.preguntas = await Pregunta.findAll({ where: { leccionId: leccion.id }, order: [['id', 'ASC']] });
  }

  return datos;
};

export const completarLeccion = async (inscripcion, leccion) => {
  if (leccion.tipo !== 'contenido') {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Un cuestionario se completa aprobándolo');
  }

  await verificarDesbloqueada(inscripcion, leccion.id);

  const [progreso] = await Progreso.findOrCreate({
    where: { inscripcionId: inscripcion.id, leccionId: leccion.id },
  });
  await progreso.update({ completada: true });
  await actualizarCompletado(inscripcion);

  return progreso;
};
