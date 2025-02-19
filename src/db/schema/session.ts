import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations, type InferSelectModel } from 'drizzle-orm';

export const sessionTable = pgTable('session', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

export const sessionRelation = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export type Session = InferSelectModel<typeof sessionTable>;
