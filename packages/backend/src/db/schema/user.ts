import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { userBoardTable } from './userBoard';
import { sessionTable } from './session';

export const userTable = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelation = relations(userTable, ({ many }) => ({
  userBoards: many(userBoardTable),
  sessions: many(sessionTable),
}));

export type User = InferSelectModel<typeof userTable>;
