import { PostgreSqlContainer } from '@testcontainers/postgresql';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '@repo/shared/src/db/schemas/schema'; // Import your database schema

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
