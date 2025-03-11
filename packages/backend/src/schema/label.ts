import { labelTable } from '@/db/schema';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const labelSelectSchema = createSelectSchema(labelTable);

export const labelCreateSchema = createInsertSchema(labelTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const labelUpdateSchema = createUpdateSchema(labelTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  boardId: true,
});
