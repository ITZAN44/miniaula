import { Leccion } from '../models/index.js';
import AppError from '../errors/AppError.js';

export const crearLeccion = async (cursoId, datos) => {
  const ultimaLeccion = await Leccion.findOne({
    where: { cursoId },
    order: [['orden', 'DESC']],
  });

  const siguienteOrden = ultimaLeccion ? ultimaLeccion.orden + 1 : 1;
  const notaMinima = datos.tipo === 'cuestionario' ? datos.notaMinima : null;

  return await Leccion.create({
    ...datos,
    cursoId,
    orden: siguienteOrden,
    notaMinima,
  });
};

export const actualizarLeccion = async (leccion, datos) => {
  return await leccion.update(datos);
};

export const eliminarLeccion = async (leccion) => {
  await leccion.destroy();
};

export const reordenarLecciones = async (cursoId, listaIds) => {
  const unicos = new Set(listaIds);
  if (unicos.size !== listaIds.length) {
    throw new AppError(400, 'VALIDATION_ERROR', 'La lista de orden contiene lecciones duplicadas');
  }

  const leccionesCurso = await Leccion.findAll({
    where: { cursoId },
    attributes: ['id'],
  });

  const idsCurso = new Set(leccionesCurso.map((l) => l.id));

  if (listaIds.length !== leccionesCurso.length || !listaIds.every((id) => idsCurso.has(id))) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Debes enviar exactamente todas las lecciones del curso para reordenar');
  }

  for (let i = 0; i < listaIds.length; i++) {
    await Leccion.update({ orden: i + 1 }, { where: { id: listaIds[i], cursoId } });
  }

  return await Leccion.findAll({
    where: { cursoId },
    order: [['orden', 'ASC']],
  });
};
