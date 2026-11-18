import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('El email no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const registroSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'El nombre es demasiado largo'),
  email: z.email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: z.enum(['estudiante', 'instructor'], 'Elige un rol'),
});

export const perfilSchema = registroSchema.pick({ nombre: true, email: true });
