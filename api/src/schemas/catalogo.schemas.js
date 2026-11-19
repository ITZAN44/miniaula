import { z } from 'zod';

export const catalogoQuerySchema = z.object({
  q: z.string().trim().max(150).optional(),
  categoria: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1, 'La página mínima es 1').default(1),
  limit: z.coerce.number().int().min(1).max(50, 'El límite máximo es 50').default(9),
});
