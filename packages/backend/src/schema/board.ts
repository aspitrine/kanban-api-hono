import { boardTable } from '@/db/schema';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const boardSelectSchema = createSelectSchema(boardTable);

export const boardCreateSchema = createInsertSchema(boardTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const boardUpdateSchema = createUpdateSchema(boardTable);
