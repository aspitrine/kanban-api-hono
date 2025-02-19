import { cardTable } from '@/db/schema';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const cardSelectSchema = createSelectSchema(cardTable);

export const cardCreateSchema = createInsertSchema(cardTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const cardUpdateSchema = createUpdateSchema(cardTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
