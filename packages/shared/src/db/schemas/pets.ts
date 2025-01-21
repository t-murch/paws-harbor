import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import z from 'zod';
import { profilesTable } from './users';

export const petSizes = ['giant', 'large', 'medium', 'small'] as const;
export type PetSizes = (typeof petSizes)[number];
export const PetSizesEnum = z.enum(petSizes);

const petSpecies = ['dog', 'cat'] as const;
export type PetSpecies = (typeof petSpecies)[number];
export const PetSpeciesEnum = z.enum(petSpecies);

export const pgSpecies = pgEnum('species', PetSpeciesEnum.options);
export const pgSizes = pgEnum('sizes', PetSizesEnum.options);

export const petsTable = pgTable('pets', {
  age: integer('age').notNull(),
  breed: text('breed'),
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  sex: text('sex').default('female'),
  size: pgSizes('size'),
  specialNeeds: text('special_needs'),
  species: pgSpecies('species').notNull(),
  userId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
});

export type InsertPet = typeof petsTable.$inferInsert;
export type SelectPet = typeof petsTable.$inferSelect;

export const newPetSchema = z.object({
  age: z.number(),
  breed: z.string(),
  id: z.string().optional(),
  name: z.string(),
  sex: z.union([z.literal('male'), z.literal('female')]),
  size: z.union([
    z.literal('small'),
    z.literal('medium'),
    z.literal('large'),
    z.literal('giant'),
  ]),
  specialNeeds: z.string().optional(),
  species: z.union([z.literal('dog'), z.literal('cat')]),
  userId: z.string().optional(),
});
export const existingPetSchema = z.object({
  age: z.number(),
  breed: z.string(),
  id: z.string(),
  name: z.string(),
  sex: z.union([z.literal('male'), z.literal('female')]),
  size: z.union([
    z.literal('small'),
    z.literal('medium'),
    z.literal('large'),
    z.literal('giant'),
  ]),
  specialNeeds: z.string().nullable(),
  species: z.union([z.literal('dog'), z.literal('cat')]),
  userId: z.string().nullable(),
});
