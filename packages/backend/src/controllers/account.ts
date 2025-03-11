import { db } from '@/db';
import { userTable } from '@/db/schema';
import { getAuthenticatedUserOrThrow } from '@/services/session';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { hash, verify } from '@node-rs/argon2';
import { HTTPException } from 'hono/http-exception';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { userSelectSchema } from '@/schema/user';
import { response200, response401 } from '@/utils/openapi';
import { messageSchema } from '@/schema/utils';

export const accountRouter = new Hono();

accountRouter
  .basePath('/account')
  .get(
    '/',
    describeRoute({
      description: 'Get the authenticated user',
      responses: {
        200: response200(userSelectSchema.omit({ password: true })),
        401: response401(),
      },
    }),
    async (c) => {
      const { password: _, ...authUser } = await getAuthenticatedUserOrThrow(c);

      return c.json(authUser);
    },
  )
  .patch(
    '/',
    describeRoute({
      description: 'Update the authenticated user',
      responses: {
        200: response200(messageSchema),
        401: response401(),
      },
    }),
    validator(
      'json',
      z.object({
        email: z.string().email().optional(),
        name: z.string().min(1).optional(),
      }),
    ),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);
      const data = c.req.valid('json');

      await db.update(userTable).set(data).where(eq(userTable.id, authUser.id));

      return c.json({ message: 'User updated' });
    },
  )
  .patch(
    '/password',
    describeRoute({
      description: 'Update the authenticated user password',
      responses: {
        200: response200(messageSchema),
        401: response401(
          z.union([z.literal('Invalid password'), z.literal('Unauthorized')]),
        ),
      },
    }),
    validator(
      'json',
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(1),
      }),
    ),
    async (c) => {
      const authUser = await getAuthenticatedUserOrThrow(c);
      const data = c.req.valid('json');

      const isValidPassword = await verify(
        authUser.password,
        data.currentPassword,
      );

      if (!isValidPassword) {
        throw new HTTPException(401, {
          message: 'Invalid password',
        });
      }

      const passwordHashed = await hash(data.newPassword);

      await db
        .update(userTable)
        .set({ password: passwordHashed })
        .where(eq(userTable.id, authUser.id));

      return c.json({ message: 'Password updated' });
    },
  );
