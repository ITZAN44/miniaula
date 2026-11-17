import { z } from 'zod';

export const cursoSchema = z.object({
  titulo: z.string().trim().min(1, 'El título es obligatorio').max(150, 'El título es demasiado largo'),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
  categoria: z.string().trim().min(1, 'La categoría es obligatoria').max(50, 'La categoría es demasiado larga'),
  nivel: z.enum(['basico', 'intermedio', 'avanzado'], 'Elige un nivel'),
});

export const leccionSchema = z
  .object({
    titulo: z.string().trim().min(1, 'El título es obligatorio').max(150, 'El título es demasiado largo'),
    tipo: z.enum(['contenido', 'cuestionario'], 'Elige un tipo'),
    contenido: z.string().trim().optional(),
    videoUrl: z.union([z.url('La URL del video no es válida'), z.literal('')]).optional(),
    notaMinima: z.union([z.coerce.number().int().min(1, 'Mínimo 1').max(100, 'Máximo 100'), z.literal('')]).optional(),
  })
  .refine(
    (datos) => datos.tipo !== 'cuestionario' || (datos.notaMinima !== '' && datos.notaMinima !== undefined),
    { message: 'La nota mínima es obligatoria para cuestionarios', path: ['notaMinima'] },
  );

export const preguntaSchema = z.object({
  enunciado: z.string().trim().min(1, 'El enunciado es obligatorio'),
  opciones: z.array(z.string().trim().min(1, 'La opción no puede estar vacía')).min(2, 'Debe haber al menos 2 opciones'),
  indiceCorrecto: z.coerce.number().int().min(0, 'Selecciona la opción correcta'),
});
