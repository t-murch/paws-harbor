import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profilesTable, pgServiceTypes, pgServiceFrequency } from "./users";

export const petServicesTable = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
  walkerId: uuid("user_id").references(() => profilesTable.id),
  duration: integer("duration"),
  price: integer("price"),
  type: pgServiceTypes("service_type").notNull(),
  frequency: pgServiceFrequency("service_frequency").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertService = typeof petServicesTable.$inferInsert;
export type SelectService = typeof petServicesTable.$inferSelect;
