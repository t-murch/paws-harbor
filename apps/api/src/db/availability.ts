import {
  date,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profilesTable, pgServiceTypes } from './users';

export const serviceAvailabilityTable = pgTable('service_availability', {
  adminId: uuid('admin_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  date: date('date').notNull(),
  endTime: time('end_time').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  serviceType: pgServiceTypes('service_type').notNull(),
  startTime: time('start_time').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const recurringAvailabilityTable = pgTable('recurring_availability', {
  adminId: uuid('admin_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  dayOfWeek: text('day_of_week').notNull(),
  endDate: time('end_time').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  serviceType: pgServiceTypes('service_type').notNull(),
  startDate: date('start_date').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
