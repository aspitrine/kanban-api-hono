import { db } from '@/db';
import { userTable } from '@/db/schema';
import {
  createSession,
  generateSessionToken,
  getSessionTokenCookie,
  invalidateSession,
} from '@/services/session';
import { getEnv } from '@/utils/env';
import { zValidator } from '@hono/zod-validator';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { setSignedCookie, deleteCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const authRouter = new Hono();

authRouter
  .basePath('/auth')
  .post(
    '/signin',
    zValidator(
      'json',
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    ),
    async (c) => {
      const { email, password } = c.req.valid('json');

      const [userFound] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email));

      if (!userFound) {
        throw new HTTPException(401, {
          message: 'Invalid email or password',
        });
      }

      const isValidPassword = await verify(userFound.password, password);

      if (!isValidPassword) {
        throw new HTTPException(401, {
          message: 'Invalid email or password',
        });
      }

      const token = generateSessionToken();
      const session = await createSession(token, userFound.id);

      // Set the session token in a signed cookie
      const { ENV, SESSION_SECRET } = getEnv();
      await setSignedCookie(c, 'session', token, SESSION_SECRET, {
        expires: session.expiresAt,
        secure: ENV === 'prod',
        sameSite: 'Lax',
      });

      const { password: _, ...user } = userFound;

      return c.json(user);
    },
  )
  .post(
    '/signup',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    ),
    async (c) => {
      const data = c.req.valid('json');
      const [userFound] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, data.email));

      if (userFound) {
        throw new HTTPException(400, {
          message: 'User already exists',
        });
      }

      const passwordHashed = await hash(data.password);

      const [{ password: _, ...user }] = await db
        .insert(userTable)
        .values({
          ...data,
          password: passwordHashed,
        })
        .returning();

      // @TODO: Change by sending a confirmation email
      const token = generateSessionToken();
      const session = await createSession(token, user.id);
      // Set the session token in a signed cookie
      const { ENV, SESSION_SECRET } = getEnv();
      await setSignedCookie(c, 'session', token, SESSION_SECRET, {
        expires: session.expiresAt,
        secure: ENV === 'prod',
        sameSite: 'Lax',
      });

      return c.json(user);
    },
  )
  .get('/signout', async (c) => {
    // Clear the session cookie
    const token = await getSessionTokenCookie(c);

    if (token) {
      await invalidateSession(token);

      // Clear the session cookie
      deleteCookie(c, 'session');
    }

    return c.json({
      message: 'Signed out',
    });
  });
