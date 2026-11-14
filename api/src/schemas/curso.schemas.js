import { z } from 'zod';

// Esquema para validar la creacion de un curso nuevo
export const crearCursoSchema = z.object({
  titulo: z.string('El título es obligatorio').trim().min(1, 'El título es obligatorio').max(150),
  descripcion: z.string('La descripción es obligatoria').trim().min(1, 'La descripción es obligatoria'),
  categoria: z.string('La categoría es obligatoria').trim().min(1, 'La categoría es obligatoria').max(50),
  nivel: z.enum(['basico', 'intermedio', 'avanzado'], 'El nivel debe ser basico, intermedio o avanzado'),
});

// Esquema para actualizar datos basicos del curso
export const editarCursoSchema = crearCursoSchema.partial().refine(
  (datos) => Object.keys(datos).length > 0,
  'Envía al menos un campo para actualizar'
);

// Esquema para cambiar el estado (publicar o archivar)
export const estadoCursoSchema = z.object({
  estado: z.enum(['publicado', 'archivado'], 'El estado debe ser publicado o archivado'),
});
