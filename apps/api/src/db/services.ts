import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import z from 'zod';
import { BASE_SERVICES, serviceFrequencies } from '../types';
import { pgServiceFrequency, pgServiceTypes } from './users';

export const petServicesTable = pgTable('services', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  description: text('description').default('').notNull(),
  duration: varchar('duration').notNull(),
  frequency: pgServiceFrequency('service_frequency').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  // ** ADD THIS TO BOOKING TABLE
  // SERVICES HAVE NO OWNERS
  // ownerId: uuid('user_id').references(() => profilesTable.id, {
  //   onDelete: 'cascade',
  // }),
  price: integer('price').notNull(),
  type: pgServiceTypes('service_type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // walkerId: uuid('user_id').references(() => profilesTable.id),
});

export type InsertService = typeof petServicesTable.$inferInsert;
export type SelectService = typeof petServicesTable.$inferSelect;

// Example of Zod schema matching the `petServicesTable` structure
export const InsertServiceSchema = z.object({
  createdAt: z.string().datetime().pipe(z.coerce.date()).optional(), // assuming dates are ISO strings
  description: z.string().optional().pipe(z.coerce.string()),
  duration: z.string().optional().pipe(z.coerce.string()),
  frequency: z.enum(serviceFrequencies), // match your pgServiceFrequency options
  id: z.string().uuid(),
  // ownerId: z.string().uuid(),
  price: z.number(),
  type: z.enum(BASE_SERVICES), // match your pgServiceTypes options
  updatedAt: z.string().datetime().pipe(z.coerce.date()).optional(),
});

export const ServiceSchema = InsertServiceSchema.extend({
  createdAt: z.string().datetime().pipe(z.coerce.date()), // assuming dates are ISO strings
  updatedAt: z.string().datetime().pipe(z.coerce.date()),
});
