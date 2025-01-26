import { defineConfig } from 'drizzle-kit';
import { databaseUrl } from './src/db/index.ts';

export default defineConfig({
  dbCredentials: {
    url: databaseUrl,
  },
  dialect: 'postgresql',
});
