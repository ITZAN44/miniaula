import { Leccion, Pregunta } from '../models/index.js';

// Crea una leccion asignandole el siguiente numero de orden disponible
export const crearLeccion = async (cursoId, datos) => {
  // Buscamos la ultima leccion del curso para calcular el nuevo orden
  const ultimaLeccion = await Leccion.findOne({
    where: { cursoId },
    order: [['orden', 'DESC']],
  });

  const siguienteOrden = ultimaLeccion ? ultimaLeccion.orden + 1 : 1;

  // Si es un cuestionario y no definieron nota minima, asignamos 70 por defecto
  const notaMinima = datos.tipo === 'cuestionario' ? (datos.notaMinima || 70) : null;

  return await Leccion.create({
    ...datos,
    cursoId,
    orden: siguienteOrden,
    notaMinima,
  });
};

// Actualiza los datos de una leccion existente
export const actualizarLeccion = async (leccion, datos) => {
  return await leccion.update(datos);
};

// Elimina una leccion del curso
export const eliminarLeccion = async (leccion) => {
  await leccion.destroy();
};

// Actualiza el orden de las lecciones dentro de un curso
export const reordenarLecciones = async (cursoId, listaOrden) => {
  // Recorremos la lista y actualizamos el campo orden de cada leccion
  for (let i = 0; i < listaOrden.length; i++) {
    const item = listaOrden[i];
    const id = typeof item === 'object' ? item.id : item;
    const nuevoOrden = typeof item === 'object' ? item.orden : i + 1;

    await Leccion.update(
      { orden: nuevoOrden },
      { where: { id, cursoId } }
    );
  }

  // Devolvemos las lecciones ya ordenadas
  return await Leccion.findAll({
    where: { cursoId },
    order: [['orden', 'ASC']],
  });
};
