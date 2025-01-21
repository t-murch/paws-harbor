import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
  out: "./supabase/migrations",
  schema: "./src/db/schemas/schema.ts",
});
