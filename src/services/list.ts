import { db } from '@/db';
import { boardTable, listTable, userBoardTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const listService = {
  async hasReadAccess(listId: number, userId: number) {
    const [listFound] = await db
      .select()
      .from(listTable)
      .leftJoin(boardTable, eq(listTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(and(eq(listTable.id, listId), eq(userBoardTable.userId, userId)));

    return !!listFound;
  },

  async hasWriteAccess(listId: number, userId: number) {
    const [listFound] = await db
      .select()
      .from(listTable)
      .leftJoin(boardTable, eq(listTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(listTable.id, listId),
          eq(userBoardTable.userId, userId),
          eq(userBoardTable.role, 'admin'),
        ),
      );

    return !!listFound;
  },
};

export default listService;
