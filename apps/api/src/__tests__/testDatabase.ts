import * as schema from '@repo/shared/db/schemas/schema';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export async function createTestDatabase() {
  // Start a PostgreSQL container
  const container = await new PostgreSqlContainer().withReuse().start();

  // Get connection details
  const connectionString = container.getConnectionUri();

  // Create a connection
  const queryClient = postgres(connectionString, { max: 1, prepare: false });
  const db = drizzle(queryClient, { schema });

  // Run migrations
  await migrate(db, { migrationsFolder: './supabase/migrations' });

  return {
    close: async () => {
      await queryClient.end();
      await container.stop();
    },
    container,
    db,
    queryClient,
  };
}
