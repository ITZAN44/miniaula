import { registroSchema } from './auth.schemas.js';

export const perfilSchema = registroSchema
  .pick({ nombre: true, email: true })
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, 'Envía al menos un campo para actualizar');
