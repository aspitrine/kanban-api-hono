import { db } from '@/db';
import { boardTable, userBoardTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const boardService = {
  async hasReadAccess(boardId: number, userId: number) {
    const [boardFound] = await db
      .select()
      .from(boardTable)
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          // board correspondant à l'id
          eq(boardTable.id, boardId),
          // board accessible par l'utilisateur authentifié
          eq(userBoardTable.userId, userId),
        ),
      );

    return !!boardFound;
  },

  async hasWriteAccess(boardId: number, userId: number) {
    const [boardFound] = await db
      .select()
      .from(boardTable)
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          // board correspondant à l'id
          eq(boardTable.id, boardId),
          // board accessible par l'utilisateur authentifié
          eq(userBoardTable.userId, userId),
          eq(userBoardTable.role, 'admin'),
        ),
      );

    return !!boardFound;
  },
};

export default boardService;
