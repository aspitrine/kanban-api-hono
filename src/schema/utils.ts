import { z } from 'zod';

export const paramsWithId = z.object({
  id: z.coerce.number().int().positive(),
});
