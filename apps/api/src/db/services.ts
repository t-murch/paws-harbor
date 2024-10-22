import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { profilesTable, pgServiceTypes, pgServiceFrequency } from './users';
import z from 'zod';
import { serviceFrequencies, serviceTypes } from '@/types';

export const petServicesTable = pgTable('services', {
  createdAt: timestamp('created_at').defaultNow(),
  description: text('description'),
  duration: varchar('duration').notNull(),
  frequency: pgServiceFrequency('service_frequency').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  price: integer('price').notNull(),
  type: pgServiceTypes('service_type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  // walkerId: uuid('user_id').references(() => profilesTable.id),
});

export type InsertService = typeof petServicesTable.$inferInsert;
export type SelectService = typeof petServicesTable.$inferSelect;

// Example of Zod schema matching the `petServicesTable` structure
export const InsertServiceSchema = z.object({
  createdAt: z.string().datetime().pipe(z.coerce.date()).optional(), // assuming dates are ISO strings
  description: z.string().optional().pipe(z.coerce.string()),
  duration: z.string(),
  frequency: z.enum(serviceFrequencies), // match your pgServiceFrequency options
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  price: z.number(),
  type: z.enum(serviceTypes), // match your pgServiceTypes options
  updatedAt: z.string().datetime().pipe(z.coerce.date()).optional(),
});

export const ServiceSchema = InsertServiceSchema.extend({
  createdAt: z.string().datetime().pipe(z.coerce.date()), // assuming dates are ISO strings
  updatedAt: z.string().datetime().pipe(z.coerce.date()),
});
