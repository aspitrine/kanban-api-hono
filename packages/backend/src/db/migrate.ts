import { migrate } from 'drizzle-orm/postgres-js/migrator';
import config from '$/drizzle.config';
import { db } from '@/db';

await migrate(db, { migrationsFolder: config.out! });
