import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable } from "./schema";
import { config } from "dotenv";

config({ path: ".env" });
// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client);

const allUsers = async () => await db.select().from(profilesTable);

export { allUsers };
