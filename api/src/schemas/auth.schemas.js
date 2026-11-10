import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string('El nombre es obligatorio').trim().min(1, 'El nombre es obligatorio').max(100),
  email: z.email('El email no es válido'),
  password: z.string('La contraseña es obligatoria').min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: z.enum(['estudiante', 'instructor'], 'El rol debe ser estudiante o instructor'),
});

export const loginSchema = z.object({
  email: z.email('El email no es válido'),
  password: z.string('La contraseña es obligatoria').min(1, 'La contraseña es obligatoria'),
});
