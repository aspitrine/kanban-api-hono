import { db } from '@/db';
import { labelTable } from '@/db/schema';
import {
  labelCreateSchema,
  labelSelectSchema,
  labelUpdateSchema,
} from '@/schema/label';
import { paramsWithId } from '@/schema/utils';
import boardService from '@/services/board';
import labelService from '@/services/label';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { response200, response401, response403 } from '@/utils/openapi';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';

export const labelRouter = new Hono();

labelRouter
  .basePath('/labels')
  .post(
    '/',
    describeRoute({
      description: 'Create a label',
      responses: {
        200: response200(labelSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('json', labelCreateSchema),
    async (c) => {
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
    },
  )
  .patch(
    '/:id',
    describeRoute({
      description: 'Update a label',
      responses: {
        200: response200(labelSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('param', paramsWithId),
    validator('json', labelUpdateSchema),
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
  .delete(
    '/:id',
    describeRoute({
      description: 'Delete a label',
      responses: {
        200: response200(labelSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('param', paramsWithId),
    async (c) => {
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
    },
  );
