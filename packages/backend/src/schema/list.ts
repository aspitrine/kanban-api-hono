import { listTable } from '@/db/schema';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const listSelectSchema = createSelectSchema(listTable);

export const listCreateSchema = createInsertSchema(listTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const listUpdateSchema = createUpdateSchema(listTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  boardId: true,
});
