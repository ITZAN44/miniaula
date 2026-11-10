import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  email: z.email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: z.enum(['estudiante', 'instructor'], 'El rol debe ser estudiante o instructor'),
});
