import {
  getSessionTokenCookie,
  validateSessionToken,
} from '@/services/session';
import { getEnv } from '@/utils/env';
import { setSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

export const autoRefreshSession = createMiddleware(async (context, next) => {
  // On récupère le token de session stocké dans les cookies
  const token = await getSessionTokenCookie(context);

  // Si il existe, on le valide
  if (token) {
    const { session } = await validateSessionToken(token);

    // Si il est valide, on prolonge sa validité dans les cookies
    if (session) {
      const { ENV, SESSION_SECRET } = getEnv();
      await setSignedCookie(context, 'session', token, SESSION_SECRET, {
        httpOnly: true,
        expires: session.expiresAt,
        secure: ENV === 'prod',
        sameSite: 'Lax',
      });
    }
  }

  await next();
});
