import { Leccion, Progreso } from '../models/index.js';

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
