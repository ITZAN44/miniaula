import sequelize from '../config/sequelize.js';
import { Curso, Leccion, Pregunta, Progreso } from '../models/index.js';
import AppError from '../errors/AppError.js';

const MAX_INTENTOS = 3;

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
    datos.intentosRestantes = MAX_INTENTOS - intentos;
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

const calificar = (preguntas, respuestas) => {
  const elegidas = new Map(respuestas.map((respuesta) => [respuesta.preguntaId, respuesta.opcion]));
  const respondioTodas =
    elegidas.size === respuestas.length &&
    respuestas.length === preguntas.length &&
    preguntas.every((pregunta) => elegidas.has(pregunta.id));

  if (!respondioTodas) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Debes responder cada pregunta del cuestionario una sola vez');
  }

  const correctas = preguntas.filter((pregunta) => elegidas.get(pregunta.id) === pregunta.indiceCorrecto).length;
  return { correctas, nota: Math.round((correctas * 100) / preguntas.length) };
};

// Se bloquea la inscripción para que dos envíos al mismo tiempo se registren de a uno y no pasen el límite
const registrarIntento = (inscripcion, leccion, nota, aprobado) =>
  sequelize.transaction(async (transaction) => {
    await inscripcion.reload({ lock: transaction.LOCK.UPDATE, transaction });
    const [progreso] = await Progreso.findOrCreate({
      where: { inscripcionId: inscripcion.id, leccionId: leccion.id },
      transaction,
    });

    if (progreso.intentos >= MAX_INTENTOS) {
      throw new AppError(422, 'UNPROCESSABLE_ENTITY', `Ya usaste los ${MAX_INTENTOS} intentos de este cuestionario`);
    }

    return await progreso.update(
      {
        intentos: progreso.intentos + 1,
        mejorNota: Math.max(progreso.mejorNota ?? 0, nota),
        completada: progreso.completada || aprobado,
      },
      { transaction },
    );
  });

export const rendirCuestionario = async (inscripcion, leccion, respuestas) => {
  if (leccion.tipo !== 'cuestionario') {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Solo se pueden rendir lecciones de tipo cuestionario');
  }

  await verificarDesbloqueada(inscripcion, leccion.id);

  const preguntas = await Pregunta.scope('conRespuesta').findAll({ where: { leccionId: leccion.id } });
  if (preguntas.length === 0) {
    throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'El cuestionario todavía no tiene preguntas');
  }

  const { correctas, nota } = calificar(preguntas, respuestas);
  const aprobado = nota >= leccion.notaMinima;
  const progreso = await registrarIntento(inscripcion, leccion, nota, aprobado);
  await actualizarCompletado(inscripcion);

  return {
    nota,
    aprobado,
    notaMinima: leccion.notaMinima,
    correctas,
    total: preguntas.length,
    mejorNota: progreso.mejorNota,
    intentos: progreso.intentos,
    intentosRestantes: MAX_INTENTOS - progreso.intentos,
  };
};
