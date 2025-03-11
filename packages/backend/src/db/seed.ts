import { hash } from '@node-rs/argon2';
import { db, pool } from '.';
import { boardTable, userBoardTable, userTable } from './schema';

// Clear the database
await db.delete(userTable);
await db.delete(boardTable);

// Seed the database with a test user
const [user] = await db
  .insert(userTable)
  .values({
    email: 'test@test.io',
    password: await hash('password'),
    name: 'Test',
  })
  .returning();

const [board] = await db
  .insert(boardTable)
  .values({
    name: 'Mon premier tableau',
  })
  .returning();

await db.insert(userBoardTable).values({
  boardId: board.id,
  userId: user.id,
  role: 'admin',
  status: 'active',
});

await pool.end();
