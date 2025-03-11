import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { cardLabelTable } from './cardLabel';
import { relations } from 'drizzle-orm';
import { boardTable } from './board';

export const labelTable = pgTable('label', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  color: varchar({ length: 255 }).notNull(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boardTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const labelRelation = relations(labelTable, ({ many, one }) => ({
  cardLabels: many(cardLabelTable),
  board: one(boardTable, {
    fields: [labelTable.boardId],
    references: [boardTable.id],
  }),
}));
