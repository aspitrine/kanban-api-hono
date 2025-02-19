import { db } from '@/db';
import { listTable } from '@/db/schema';
import { listCreateSchema, listUpdateSchema } from '@/schema/list';
import { paramsWithId } from '@/schema/utils';
import boardService from '@/services/board';
import listService from '@/services/list';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { zValidator } from '@hono/zod-validator';
import { eq, max } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const listRouter = new Hono();

listRouter
  .basePath('/lists')
  .post('/', zValidator('json', listCreateSchema), async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);
    const listData = c.req.valid('json');

    const hasWriteAccess = await boardService.hasWriteAccess(
      listData.boardId,
      authUser.id,
    );

    if (!hasWriteAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this board',
      });
    }

    if (!listData.position) {
      const [positionResult] = await db
        .select({ positionMax: max(listTable.position) })
        .from(listTable)
        .where(eq(listTable.boardId, listData.boardId));

      listData.position =
        typeof positionResult?.positionMax === 'number'
          ? positionResult.positionMax + 1
          : 0;
    }

    const [listCreated] = await db
      .insert(listTable)
      .values(listData)
      .returning();
    return c.json(listCreated);
  })
  .patch(
    '/:id',
    zValidator('param', paramsWithId),
    zValidator('json', listUpdateSchema),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const listData = c.req.valid('json');
      const { id } = c.req.valid('param');

      const hasWriteAccess = await listService.hasWriteAccess(id, authUser.id);

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this board',
        });
      }

      const [listUpdated] = await db
        .update(listTable)
        .set(listData)
        .where(eq(listTable.id, id))
        .returning();

      if (!listUpdated) {
        throw new HTTPException(404, {
          message: 'List not found',
        });
      }
      return c.json(listUpdated);
    },
  )
  .delete('/:id', zValidator('param', paramsWithId), async (c) => {
    const { id } = c.req.valid('param');
    const authUser = await getAuthenticatedUserOrThrow(c);

    const hasWriteAccess = await listService.hasWriteAccess(id, authUser.id);

    if (!hasWriteAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this board',
      });
    }

    const [listDeleted] = await db
      .delete(listTable)
      .where(eq(listTable.id, id))
      .returning();

    if (!listDeleted) {
      throw new HTTPException(404, {
        message: 'List not found',
      });
    }

    return c.json(listDeleted);
  });
