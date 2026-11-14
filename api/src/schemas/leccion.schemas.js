import { z } from 'zod';

// Esquema para validar la creacion de una leccion nueva
export const crearLeccionSchema = z.object({
  titulo: z.string('El título es obligatorio').trim().min(1, 'El título es obligatorio').max(150),
  tipo: z.enum(['contenido', 'cuestionario'], 'El tipo debe ser contenido o cuestionario'),
  contenido: z.string().trim().optional().nullable(),
  videoUrl: z.string().trim().optional().nullable(),
  notaMinima: z.number().int().min(1, 'La nota mínima debe ser mayor a 0').max(100, 'La nota máxima es 100').optional().nullable(),
});

// Esquema para editar una leccion existente
export const editarLeccionSchema = z.object({
  titulo: z.string().trim().min(1, 'El título no puede estar vacío').max(150).optional(),
  contenido: z.string().trim().optional().nullable(),
  videoUrl: z.string().trim().optional().nullable(),
  notaMinima: z.number().int().min(1, 'La nota mínima debe ser mayor a 0').max(100, 'La nota máxima es 100').optional().nullable(),
}).refine(
  (datos) => Object.keys(datos).length > 0,
  'Envía al menos un campo para actualizar'
);

// Esquema para validar el reordenamiento de lecciones
// Permite una lista de objetos { id, orden } o una lista simple de ids ordenados
export const reordenarLeccionesSchema = z.object({
  orden: z.union([
    z.array(
      z.object({
        id: z.number().int().positive('El id de la lección debe ser positivo'),
        orden: z.number().int().positive('El número de orden debe ser positivo'),
      })
    ).min(1, 'Debes enviar al menos una lección'),
    z.array(z.number().int().positive()).min(1, 'Debes enviar al menos una lección'),
  ]),
});
