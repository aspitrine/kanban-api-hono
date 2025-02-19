import { db } from '@/db';
import { labelTable } from '@/db/schema';
import { labelCreateSchema, labelUpdateSchema } from '@/schema/label';
import { paramsWithId } from '@/schema/utils';
import boardService from '@/services/board';
import labelService from '@/services/label';
import {
  getAuthenticatedUser,
  getAuthenticatedUserOrThrow,
} from '@/services/session';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const labelRouter = new Hono();

labelRouter
  .basePath('/labels')
  .post('/', zValidator('json', labelCreateSchema), async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);

    const data = c.req.valid('json');

    const hasWriteAccess = await boardService.hasWriteAccess(
      authUser.id,
      data.boardId,
    );

    if (!hasWriteAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this board',
      });
    }

    const label = await db.insert(labelTable).values(data).returning();

    return c.json(label);
  })
  .patch(
    '/:id',
    zValidator('param', paramsWithId),
    zValidator('json', labelUpdateSchema),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const data = c.req.valid('json');
      const id = c.req.valid('param').id;

      const hasWriteAccess = await labelService.hasWriteAccess(id, authUser.id);

      if (!hasWriteAccess) {
        throw new HTTPException(404, {
          message: 'You do not have access to this label',
        });
      }

      const [labelUpdated] = await db
        .update(labelTable)
        .set(data)
        .where(eq(labelTable.id, id))
        .returning();

      return c.json(labelUpdated);
    },
  )
  .delete('/:id', zValidator('param', paramsWithId), async (c) => {
    const authUser = await getAuthenticatedUserOrThrow(c);

    const id = c.req.valid('param').id;

    const hasWriteAccess = await labelService.hasWriteAccess(id, authUser.id);

    if (!hasWriteAccess) {
      throw new HTTPException(403, {
        message: 'You do not have access to this label',
      });
    }

    const [labelDeleted] = await db
      .delete(labelTable)
      .where(eq(labelTable.id, id))
      .returning();

    return c.json(labelDeleted);
  });
