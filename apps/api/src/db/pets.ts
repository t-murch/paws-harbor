import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from "./users";
import { pgEnum } from "drizzle-orm/pg-core";
import { PetSpeciesEnum } from "@/types";
import z from "zod";

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

export const newPetSchema = z.object({
  species: z.union([z.literal("dog"), z.literal("cat")]),
  id: z.string().optional(),
  name: z.string(),
  userId: z.string().nullable(),
  breed: z.string().nullable(),
  age: z.number().nullable(),
  weight: z.string().nullable(),
  specialNeeds: z.string().nullable(),
});
export const existingPetSchema = z.object({
  species: z.union([z.literal("dog"), z.literal("cat")]),
  id: z.string(),
  name: z.string(),
  userId: z.string().nullable(),
  breed: z.string().nullable(),
  age: z.number().nullable(),
  weight: z.string().nullable(),
  specialNeeds: z.string().nullable(),
});
