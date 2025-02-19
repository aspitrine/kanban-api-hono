import { z } from 'zod';

const envSchema = z.object({
  ENV: z.union([z.literal('dev'), z.literal('prod')]).default('dev'),
  SESSION_SECRET: z.string().min(32),
  PORT: z.coerce.number().positive().int().default(3000),
});

export function getEnv() {
  return envSchema.parse(process.env);
}
