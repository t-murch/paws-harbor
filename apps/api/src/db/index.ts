import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { seed } from 'drizzle-seed';
import postgres from 'postgres';
import * as mySchema from './schema';
import { PgTable } from 'drizzle-orm/pg-core';
import { getTableColumns, SQL, sql } from 'drizzle-orm';

config({ path: '.env' });
export const isProd = process.env.NODE_ENV === 'production';
// Disable prefetch as it is not supported for "Transaction" pool mode
export const databaseUrl = isProd
  ? process.env.DATABASE_URL!
  : process.env.LOCAL_DATABASE_URL!;
const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle({ client });

//TODO: add to shared repo.
export type GeneralResponse<T, E> =
  | { data: T; success: true }
  | { error: E; success: false };
export type GeneralError = { details?: any; message: string };

async function main() {
  // eslint-disable-next-line no-unused-vars
  await seed(db, mySchema).refine((_f) => ({
    services: {
      count: 12,
      with: {
        service_pricing: 3,
      },
    },
  }));
}

export const buildConflictUpdateColumns = <
  T extends PgTable,
  Q extends keyof T['_']['columns'],
>(
  table: T,
  columns: Q[]
) => {
  const cls = getTableColumns(table);

  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);

      return acc;
    },
    {} as Record<Q, SQL>
  );
};

// main().catch((err) => {
//   console.error(`error on seed: ${JSON.stringify(err, null, 2)}`);
// });
