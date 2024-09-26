import { decimal, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { profilesTable } from './users';
import { pgEnum } from 'drizzle-orm/pg-core';
import { PetSpeciesEnum } from '@/types';
import z from 'zod';

export const pgSpecies = pgEnum('species', PetSpeciesEnum.options);

export const petsTable = pgTable('pets', {
  age: integer('age'),
  breed: text('breed'),
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  specialNeeds: text('special_needs'),
  species: pgSpecies('species').notNull(),
  userId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  weight: decimal('weight'),
});

export type InsertPet = typeof petsTable.$inferInsert;
export type SelectPet = typeof petsTable.$inferSelect;

export const newPetSchema = z.object({
  age: z.number().nullable(),
  breed: z.string().nullable(),
  id: z.string().optional(),
  name: z.string(),
  specialNeeds: z.string().optional(),
  species: z.union([z.literal('dog'), z.literal('cat')]),
  userId: z.string().optional(),
});
export const existingPetSchema = z.object({
  age: z.number().nullable(),
  breed: z.string().nullable(),
  id: z.string(),
  name: z.string(),
  specialNeeds: z.string().nullable(),
  species: z.union([z.literal('dog'), z.literal('cat')]),
  userId: z.string().nullable(),
  weight: z.string().nullable(),
});
