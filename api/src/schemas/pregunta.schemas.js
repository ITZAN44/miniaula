import { z } from 'zod';

// Esquema para validar la creacion de una pregunta de opcion multiple
export const crearPreguntaSchema = z.object({
  enunciado: z.string('El enunciado es obligatorio').trim().min(1, 'El enunciado es obligatorio'),
  opciones: z.array(z.string().trim().min(1, 'La opción no puede estar vacía')).min(2, 'Debe haber al menos 2 opciones'),
  indiceCorrecto: z.number('El índice correcto debe ser un número').int().min(0, 'El índice correcto no puede ser negativo'),
}).refine(
  (datos) => datos.indiceCorrecto < datos.opciones.length,
  'El índice correcto debe corresponder a una de las opciones enviadas'
);

// Esquema para actualizar una pregunta existente
export const editarPreguntaSchema = z.object({
  enunciado: z.string().trim().min(1, 'El enunciado no puede estar vacío').optional(),
  opciones: z.array(z.string().trim().min(1, 'La opción no puede estar vacía')).min(2, 'Debe haber al menos 2 opciones').optional(),
  indiceCorrecto: z.number().int().min(0, 'El índice correcto no puede ser negativo').optional(),
}).refine(
  (datos) => Object.keys(datos).length > 0,
  'Envía al menos un campo para actualizar'
).refine(
  (datos) => {
    // Si envia ambas cosas en la actualizacion, validamos coherencia
    if (datos.opciones && datos.indiceCorrecto !== undefined) {
      return datos.indiceCorrecto < datos.opciones.length;
    }
    return true;
  },
  'El índice correcto debe corresponder a una de las opciones enviadas'
);
