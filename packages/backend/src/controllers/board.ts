import { db } from '@/db';
import { boardTable, userBoardTable } from '@/db/schema';
import {
  boardCreateSchema,
  boardSelectSchema,
  boardUpdateSchema,
} from '@/schema/board';
import { cardSelectSchema } from '@/schema/card';
import { labelSelectSchema } from '@/schema/label';
import { listSelectSchema } from '@/schema/list';
import { messageSchema, paramsWithId } from '@/schema/utils';
import boardService from '@/services/board';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { response200, response401, response403 } from '@/utils/openapi';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const boardRouter = new Hono();

boardRouter
  .basePath('/boards')
  .get(
    '/',
    describeRoute({
      description: 'Get all boards',
      responses: {
        200: response200(z.array(boardSelectSchema)),
        401: response401(),
      },
    }),
    async (c) => {
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
    },
  )
  .get(
    '/pending',
    describeRoute({
      description: 'Get all the pending boards',
      responses: {
        200: response200(z.array(boardSelectSchema)),
        401: response401(),
      },
    }),
    async (c) => {
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
    },
  )
  .get(
    '/:id',
    describeRoute({
      description:
        'Get a board by id with lists and cards associated and labels',
      responses: {
        200: response200(
          boardSelectSchema.extend({
            lists: z.array(
              listSelectSchema.extend({ cards: z.array(cardSelectSchema) }),
            ),
            labels: z.array(labelSelectSchema),
          }),
        ),
        401: response401(),
      },
    }),
    validator('param', paramsWithId),
    async (c) => {
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
    },
  )
  .post(
    '/',
    describeRoute({
      description: 'Create a board',
      responses: {
        200: response200(boardSelectSchema),
        401: response401(),
      },
    }),
    validator('json', boardCreateSchema),
    async (c) => {
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
    },
  )
  .patch(
    '/:id',
    describeRoute({
      description: 'Update a board',
      responses: {
        200: response200(boardSelectSchema),
        401: response401(),
        403: response403(
          z.object({
            message: z.literal('You do not have access to this board'),
          }),
        ),
      },
    }),
    validator('param', paramsWithId),
    validator('json', boardUpdateSchema),
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

      return c.json(boardUpdated);
    },
  )
  .delete(
    '/:id',
    describeRoute({
      description: 'Delete a board',
      responses: {
        200: response200(boardSelectSchema),
        401: response401(),
        403: response403(
          z.object({
            message: z.literal('You do not have access to this board'),
          }),
        ),
      },
    }),

    validator('param', paramsWithId),
    async (c) => {
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

      return c.json(boardDeleted);
    },
  )
  .post(
    '/:id/users',
    describeRoute({
      description: 'Add a user to a board',
      responses: {
        200: response200(messageSchema),
        401: response401(),
        403: response403(
          z.object({
            message: z.literal('You do not have access to this board'),
          }),
        ),
      },
    }),
    validator('param', paramsWithId),
    validator(
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
        ...data,
        boardId,
        status: 'pending',
      });

      return c.json({ message: 'User added to board' });
    },
  )
  .delete(
    '/:id/users/:userId',
    describeRoute({
      description: 'Remove a user from a board',
      responses: {
        200: response200(messageSchema),
        401: response401(),
        403: response403(
          z.object({
            message: z.literal('You do not have access to this board'),
          }),
        ),
      },
    }),
    validator(
      'param',
      paramsWithId.extend({ userId: z.coerce.number().positive().int() }),
    ),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const { id: boardId, userId } = c.req.valid('param');
      const hasWriteAccess = await boardService.hasWriteAccess(
        boardId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this board',
        });
      }

      await db
        .delete(userBoardTable)
        .where(
          and(
            eq(userBoardTable.boardId, boardId),
            eq(userBoardTable.userId, userId),
          ),
        );

      return c.json({ message: 'User removed from board' });
    },
  );
