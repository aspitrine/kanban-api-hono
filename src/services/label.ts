import { db } from '@/db';
import { boardTable, labelTable, listTable, userBoardTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const labelService = {
  async hasReadAccess(labelId: number, userId: number) {
    const [dataFound] = await db
      .select()
      .from(labelTable)
      .leftJoin(boardTable, eq(labelTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(eq(labelTable.id, labelId), eq(userBoardTable.userId, userId)),
      );

    return !!dataFound;
  },

  async hasWriteAccess(labelId: number, userId: number) {
    const [dataFound] = await db
      .select()
      .from(labelTable)
      .leftJoin(boardTable, eq(labelTable.boardId, boardTable.id))
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(labelTable.id, labelId),
          eq(userBoardTable.userId, userId),
          eq(userBoardTable.role, 'admin'),
        ),
      );

    return !!dataFound;
  },
};

export default labelService;
