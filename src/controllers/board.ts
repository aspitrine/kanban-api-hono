import { db } from '@/db';
import { boardTable, userBoardTable } from '@/db/schema';
import { boardCreateSchema, boardUpdateSchema } from '@/schema/board';
import { paramsWithId } from '@/schema/utils';
import boardService from '@/services/board';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const boardRouter = new Hono();

boardRouter
  .basePath('/boards')
  .get('/', async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);

    const boards = await db
      .select()
      .from(boardTable)
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(userBoardTable.userId, authUser.id),
          eq(userBoardTable.status, 'active'),
        ),
      );

    return c.json(boards.map(({ board }) => board));
  })
  .get('/pending', async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);

    const boards = await db
      .select()
      .from(boardTable)
      .leftJoin(userBoardTable, eq(boardTable.id, userBoardTable.boardId))
      .where(
        and(
          eq(userBoardTable.userId, authUser.id),
          eq(userBoardTable.status, 'pending'),
        ),
      );

    return c.json(boards.map(({ board }) => board));
  })
  .get('/:id', zValidator('param', paramsWithId), async (c) => {
    const boardId = c.req.valid('param').id;
    const authUser = await getAuthenticatedUserOrThrow(c);

    // On vérifie que l'utilisateur a accès au board
    const hasReadAccess = await boardService.hasReadAccess(
      boardId,
      authUser.id,
    );

    if (!hasReadAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this board',
      });
    }

    // On sait que l'utilisateur a accès au board on récupère le board avec les données associées
    const board = await db.query.boardTable.findFirst({
      where: eq(boardTable.id, boardId),
      with: {
        lists: {
          orderBy: (listTable, { asc }) => asc(listTable.position),
          with: {
            cards: {
              orderBy: (cardTable, { asc }) => asc(cardTable.position),
            },
          },
        },
        labels: true,
      },
    });

    return c.json(board);
  })
  .post('/', zValidator('json', boardCreateSchema), async (c) => {
    const boardData = c.req.valid('json');
    const authUser = await getAuthenticatedUserOrThrow(c);

    const board = await db.transaction(async (trx) => {
      const [boardCreated] = await trx
        .insert(boardTable)
        .values(boardData)
        .returning();

      await trx.insert(userBoardTable).values({
        userId: authUser.id,
        boardId: boardCreated.id,
        role: 'admin',
        status: 'active',
      });

      return boardCreated;
    });

    return c.json(board);
  })
  .patch(
    '/:id',
    zValidator('param', paramsWithId),
    zValidator('json', boardUpdateSchema),
    async (c) => {
      const { id: boardId } = c.req.valid('param');
      const authUser = await getAuthenticatedUserOrThrow(c);

      const hasWriteAccess = await boardService.hasWriteAccess(
        boardId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this board',
        });
      }

      const boardData = c.req.valid('json');

      const [boardUpdated] = await db
        .update(boardTable)
        .set(boardData)
        .where(eq(boardTable.id, boardId))
        .returning();

      if (!boardUpdated) {
        throw new HTTPException(404, {
          message: 'board not found',
        });
      }
      return c.json(boardUpdated);
    },
  )
  .delete('/:id', zValidator('param', paramsWithId), async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);
    const boardId = c.req.valid('param').id;

    const hasWriteAccess = await boardService.hasWriteAccess(
      boardId,
      authUser.id,
    );

    if (!hasWriteAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this board',
      });
    }

    const [boardDeleted] = await db
      .delete(boardTable)
      .where(eq(boardTable.id, boardId))
      .returning();

    if (!boardDeleted) {
      throw new HTTPException(404, {
        message: 'board not found',
      });
    }

    return c.json(boardDeleted);
  })
  .post(
    '/:id/users',
    zValidator('param', paramsWithId),
    zValidator(
      'json',
      z.object({
        userId: z.number().positive().int(),
        role: z.union([z.literal('admin'), z.literal('member')]),
      }),
    ),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const boardId = c.req.valid('param').id;
      const data = c.req.valid('json');
      const hasWriteAccess = await boardService.hasWriteAccess(
        boardId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this board',
        });
      }

      await db.insert(userBoardTable).values({
        boardId,
        ...data,
      });

      return c.json({ message: 'User added to board' });
    },
  );
