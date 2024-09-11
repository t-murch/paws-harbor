import { createClient } from "@supabase/supabase-js";

const DATABASE_URL = process.env.AUTH_URL!;
export const authClient = createClient(
  DATABASE_URL,
  process.env.AUTH_SERVICE_KEY!,
);
