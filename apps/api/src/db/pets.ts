import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from "./users";
import { pgEnum } from "drizzle-orm/pg-core";
import { PetSpeciesEnum } from "@/types";

export const pgSpecies = pgEnum("species", PetSpeciesEnum.options);

export const petsTable = pgTable("pets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  species: pgSpecies("species").notNull(),
  breed: text("breed"),
  age: integer("age"),
  weight: decimal("weight"),
  specialNeeds: text("special_needs"),
});

export type InsertPet = typeof petsTable.$inferInsert;
export type SelectPet = typeof petsTable.$inferSelect;
