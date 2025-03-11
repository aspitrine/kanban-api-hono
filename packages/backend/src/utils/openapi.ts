import { resolver } from 'hono-openapi/zod';
import { z, type ZodSchema } from 'zod';

export const response400 = (schema: ZodSchema = z.literal('Bad request')) => ({
  description: 'Bad request',
  content: {
    'text/plain': {
      schema: resolver(schema),
    },
  },
});

export const response401 = (schema: ZodSchema = z.literal('Unauthorized')) => ({
  description: 'Unauthorized',
  content: {
    'text/plain': {
      schema: resolver(schema),
    },
  },
});

export const response403 = (schema: ZodSchema = z.literal('Forbidden')) => ({
  description: 'Forbidden',
  content: {
    'text/plain': {
      schema: resolver(schema),
    },
  },
});

export const response200 = (schema: ZodSchema) => ({
  description: 'Successful response',
  content: {
    'application/json': {
      schema: resolver(schema),
    },
  },
});
