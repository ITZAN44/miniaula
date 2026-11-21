import { z } from 'zod';

export const intentoSchema = z.object({
  respuestas: z
    .array(
      z.object({
        preguntaId: z.number().int().positive(),
        opcion: z.number().int().min(0, 'La opción no puede ser negativa'),
      }),
    )
    .min(1, 'Debes enviar al menos una respuesta'),
});
