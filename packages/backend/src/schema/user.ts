import { userTable } from '@/db/schema';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const userSelectSchema = createSelectSchema(userTable);

export const userCreateSchema = createInsertSchema(userTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const userUpdateSchema = createUpdateSchema(userTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
