import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { cardTable } from './card';
import { labelTable } from './label';
import { relations } from 'drizzle-orm';

export const cardLabelTable = pgTable('card_label', {
  id: serial('id').primaryKey(),
  cardId: integer('card_id')
    .notNull()
    .references(() => cardTable.id, { onDelete: 'cascade' }),
  labelId: integer('label_id')
    .notNull()
    .references(() => labelTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cardLabelRelation = relations(cardLabelTable, ({ one }) => ({
  card: one(cardTable, {
    fields: [cardLabelTable.cardId],
    references: [cardTable.id],
  }),
  label: one(labelTable, {
    fields: [cardLabelTable.labelId],
    references: [labelTable.id],
  }),
}));
