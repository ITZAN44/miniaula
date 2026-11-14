import { z } from 'zod';

export const crearLeccionSchema = z
  .object({
    titulo: z.string('El título es obligatorio').trim().min(1, 'El título es obligatorio').max(150),
    tipo: z.enum(['contenido', 'cuestionario'], 'El tipo debe ser contenido o cuestionario'),
    contenido: z.string().trim().optional().nullable(),
    videoUrl: z.string().url('La URL del video no es válida').or(z.literal('')).optional().nullable(),
    notaMinima: z.number().int().min(1, 'La nota mínima debe ser mayor a 0').max(100, 'La nota máxima es 100').optional().nullable(),
  })
  .refine(
    (datos) => datos.tipo !== 'cuestionario' || (datos.notaMinima !== undefined && datos.notaMinima !== null),
    { message: 'La nota mínima es obligatoria para cuestionarios', path: ['notaMinima'] }
  );

export const editarLeccionSchema = z
  .object({
    titulo: z.string().trim().min(1, 'El título no puede estar vacío').max(150).optional(),
    contenido: z.string().trim().optional().nullable(),
    videoUrl: z.string().url('La URL del video no es válida').or(z.literal('')).optional().nullable(),
    notaMinima: z.number().int().min(1, 'La nota mínima debe ser mayor a 0').max(100, 'La nota máxima es 100').optional().nullable(),
  })
  .refine((datos) => Object.keys(datos).length > 0, 'Envía al menos un campo para actualizar');

// Lista simple con los ids de las lecciones en el nuevo orden deseado
export const reordenarLeccionesSchema = z.object({
  orden: z.array(z.number().int().positive('El id de la lección debe ser un número positivo')).min(1, 'Debes enviar al menos una lección'),
});
