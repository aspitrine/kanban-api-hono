import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { listTable } from './list';
import { cardLabelTable } from './cardLabel';

export const cardTable = pgTable('card', {
  id: serial('id').primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull().default(''),
  color: varchar({ length: 255 }).notNull().default('#F0F'),
  position: integer().notNull().default(0),
  listId: integer('list_id')
    .notNull()
    .references(() => listTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cardRelation = relations(cardTable, ({ one, many }) => ({
  list: one(listTable, {
    fields: [cardTable.listId],
    references: [listTable.id],
  }),
  cardLabels: many(cardLabelTable),
}));
