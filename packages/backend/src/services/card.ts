import { db } from '@/db';
import { boardTable, cardTable, listTable, userBoardTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const cardService = {
  async hasReadAccess(cardId: number, userId: number) {
    const [cardFound] = await db
      .select()
      .from(cardTable)
      .leftJoin(listTable, eq(cardTable.listId, listTable.id))
      .leftJoin(boardTable, eq(listTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(cardTable.id, cardId),
          eq(userBoardTable.userId, userId),
          eq(userBoardTable.role, 'admin'),
        ),
      );

    return !!cardFound;
  },

  async hasWriteAccess(cardId: number, userId: number) {
    const [cardFound] = await db
      .select()
      .from(cardTable)
      .leftJoin(listTable, eq(cardTable.listId, listTable.id))
      .leftJoin(boardTable, eq(listTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(cardTable.id, cardId),
          eq(userBoardTable.userId, userId),
          eq(userBoardTable.role, 'admin'),
        ),
      );

    return !!cardFound;
  },
};

export default cardService;
