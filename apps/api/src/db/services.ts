import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { profilesTable, pgServiceTypes, pgServiceFrequency } from './users';

export const petServicesTable = pgTable('services', {
  createdAt: timestamp('created_at').defaultNow(),
  duration: integer('duration'),
  frequency: pgServiceFrequency('service_frequency').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  notes: text('notes'),
  ownerId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  price: integer('price'),
  type: pgServiceTypes('service_type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  walkerId: uuid('user_id').references(() => profilesTable.id),
});

export type InsertService = typeof petServicesTable.$inferInsert;
export type SelectService = typeof petServicesTable.$inferSelect;
