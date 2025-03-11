import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { cardTable } from './card';
import { relations } from 'drizzle-orm';
import { boardTable } from './board';

export const listTable = pgTable('list', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  position: integer().notNull().default(0),
  boardId: integer()
    .notNull()
    .references(() => boardTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const listRelation = relations(listTable, ({ many, one }) => ({
  cards: many(cardTable),
  board: one(boardTable, {
    fields: [listTable.boardId],
    references: [boardTable.id],
  }),
}));
