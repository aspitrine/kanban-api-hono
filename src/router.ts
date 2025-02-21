import { cardRouter } from '@/controllers/card';
import { Hono } from 'hono';
import { listRouter } from './controllers/list';
import { authRouter } from './controllers/auth';
import { boardRouter } from './controllers/board';
import { labelRouter } from './controllers/label';
import { accountRouter } from './controllers/account';

export const router = new Hono();

router.route('/api/v1', authRouter);
router.route('/api/v1', boardRouter);
router.route('/api/v1', listRouter);
router.route('/api/v1', cardRouter);
router.route('/api/v1', labelRouter);
router.route('/api/v1', accountRouter);
