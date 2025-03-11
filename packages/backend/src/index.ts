import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { router } from './router';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { autoRefreshSession } from './middlewares/session';
import { getEnv } from './utils/env';
import { openAPISpecs } from 'hono-openapi';
import { apiReference } from '@scalar/hono-api-reference';

const app = new Hono();

app.use(
  cors({
    origin: getEnv().CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  csrf({
    origin: getEnv().CORS_ORIGIN,
  }),
);

// On ajoute le middleware de gestion des sessions
// pour rafraîchir les tokens de session automatiquement si besoin
app.use(autoRefreshSession);

app.route('/', router);

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Kanban API',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    },
  }),
);

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  }),
);

const port = getEnv().PORT;
console.log(`show docs http://localhost:${port}/docs`);

serve({
  fetch: app.fetch,
  port,
});
