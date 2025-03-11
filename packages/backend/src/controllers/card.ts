import { db } from '@/db';
import { cardLabelTable, cardTable } from '@/db/schema';
import {
  cardCreateSchema,
  cardSelectSchema,
  cardUpdateSchema,
} from '@/schema/card';
import { messageSchema, paramsWithId } from '@/schema/utils';
import cardService from '@/services/card';
import listService from '@/services/list';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { response200, response401, response403 } from '@/utils/openapi';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const cardRouter = new Hono();

cardRouter
  .basePath('/cards')
  .get(
    '/:id',
    describeRoute({
      description: 'Get a card',
      responses: {
        200: response200(cardSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('param', paramsWithId),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      // On vérifie que l'utilisateur a accès à la carte
      const hasReadAccess = await cardService.hasReadAccess(
        c.req.valid('param').id,
        authUser.id,
      );

      if (!hasReadAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this card',
        });
      }

      const card = await db.query.cardTable.findFirst({
        where: eq(cardTable.id, c.req.valid('param').id),
        with: {
          cardLabels: {
            with: {
              label: true,
            },
          },
        },
      });

      if (!card) {
        throw new HTTPException(404, {
          message: 'Card not found',
        });
      }

      return c.json(card);
    },
  )
  .post(
    '/',
    describeRoute({
      description: 'Create a card',
      responses: {
        200: response200(cardSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('json', cardCreateSchema),
    async (c) => {
      const cardData = c.req.valid('json');

      // On vérifie que l'utilisateur a accès à la liste en admin
      const authUser = await getAuthenticatedUserOrThrow(c);

      const hasWriteAccess = await listService.hasWriteAccess(
        cardData.listId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this list',
        });
      }

      const [cardCreated] = await db
        .insert(cardTable)
        .values(cardData)
        .returning();

      return c.json(cardCreated);
    },
  )
  .patch(
    '/:id',
    describeRoute({
      description: 'Update a card',
      responses: {
        200: response200(cardSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('param', paramsWithId),
    validator('json', cardUpdateSchema),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);
      const cardData = c.req.valid('json');

      // On vérifie que l'utilisateur au board de la carte en admin
      const hasWriteAccess = await cardService.hasWriteAccess(
        c.req.valid('param').id,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this card',
        });
      }

      const [cardUpdated] = await db
        .update(cardTable)
        .set(cardData)
        .where(eq(cardTable.id, c.req.valid('param').id))
        .returning();

      if (!cardUpdated) {
        throw new HTTPException(404, {
          message: 'card not found',
        });
      }
      return c.json(cardUpdated);
    },
  )
  .delete(
    '/:id',
    describeRoute({
      description: 'Delete a card',
      responses: {
        200: response200(cardSelectSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator('param', paramsWithId),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      // On vérifie que l'utilisateur au board de la carte en admin
      const hasWriteAccess = await cardService.hasWriteAccess(
        c.req.valid('param').id,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this card',
        });
      }

      const [cardDeleted] = await db
        .delete(cardTable)
        .where(eq(cardTable.id, c.req.valid('param').id))
        .returning();

      if (!cardDeleted) {
        throw new HTTPException(404, {
          message: 'card not found',
        });
      }
      return c.json(cardDeleted);
    },
  )

  .post(
    '/:id/labels/:labelId',
    describeRoute({
      description: 'Add a label to a card',
      responses: {
        200: response200(messageSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator(
      'param',
      paramsWithId.extend({
        labelId: z.coerce.number().positive().int(),
      }),
    ),

    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const { id: cardId, labelId } = c.req.valid('param');

      const hasWriteAccess = await cardService.hasWriteAccess(
        cardId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this card',
        });
      }

      await db.insert(cardLabelTable).values({
        cardId,
        labelId,
      });

      return c.json({
        message: 'Label assigned',
      });
    },
  )
  .delete(
    '/:id/labels/:labelId',
    describeRoute({
      description: 'Remove a label from a card',
      responses: {
        200: response200(messageSchema),
        401: response401(),
        403: response403(),
      },
    }),
    validator(
      'param',
      paramsWithId.extend({ labelId: z.coerce.number().positive().int() }),
    ),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);

      const { id: cardId, labelId } = c.req.valid('param');

      const hasWriteAccess = await cardService.hasWriteAccess(
        cardId,
        authUser.id,
      );

      if (!hasWriteAccess) {
        throw new HTTPException(403, {
          message: 'You do not have access to this card',
        });
      }

      await db
        .delete(cardLabelTable)
        .where(
          and(
            eq(cardLabelTable.cardId, cardId),
            eq(cardLabelTable.labelId, labelId),
          ),
        );

      return c.json({
        message: 'Label unassign removed',
      });
    },
  );
