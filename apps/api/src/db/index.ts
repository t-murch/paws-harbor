import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const isProd = process.env.NODE_ENV === 'production';
// Disable prefetch as it is not supported for "Transaction" pool mode
const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL!
    : process.env.LOCAL_DATABASE_URL!;
const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle({ client, logger: !isProd });
