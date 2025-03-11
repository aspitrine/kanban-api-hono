import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userTable } from './user';
import { boardTable } from './board';

export const boardRoleEnum = pgEnum('role', ['admin', 'member']);
export const boardStatusEnum = pgEnum('status', [
  'accepted',
  'suspended',
  'pending',
  'declined',
]);

export const userBoardTable = pgTable('user_board', {
  id: serial('id').primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  boardId: integer()
    .notNull()
    .references(() => boardTable.id, { onDelete: 'cascade' }),
  role: boardRoleEnum().default('member'),
  status: boardStatusEnum().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userBoardRelation = relations(userBoardTable, ({ many, one }) => ({
  user: one(userTable, {
    fields: [userBoardTable.userId],
    references: [userTable.id],
  }),
  board: one(boardTable, {
    fields: [userBoardTable.boardId],
    references: [boardTable.id],
  }),
}));
