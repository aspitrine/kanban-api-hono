import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { listTable } from './list';
import { labelTable } from './label';
import { userBoardTable } from './userBoard';

export const boardTable = pgTable('board', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const boardRelation = relations(boardTable, ({ many }) => ({
  lists: many(listTable),
  labels: many(labelTable),
  userBoards: many(userBoardTable),
}));
