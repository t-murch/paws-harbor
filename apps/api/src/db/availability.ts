import {
  date,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profilesTable, pgServiceTypes } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const serviceAvailabilityTable = pgTable('service_availability', {
  adminId: uuid('admin_id')
    .references(() => profilesTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  date: date('date').notNull(),
  endTime: time('end_time').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  serviceType: pgServiceTypes('service_type').notNull(),
  startTime: time('start_time').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertServiceAvailabilitySchema = createInsertSchema(
  serviceAvailabilityTable,
  {
    createdAt: ({ createdAt }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((date) => date.toISOString())
        .optional()
        .pipe(createdAt),
    date: ({ date }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((date) => date.toISOString())
        .pipe(date),
    endTime: ({ endTime }) =>
      z
        .union([z.string(), z.string().time()])
        .pipe(z.coerce.string().time())
        .transform((time) => String(time))
        .pipe(endTime),
    startTime: ({ startTime }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.string().time())
        .transform((time) => String(time))
        .pipe(startTime),
    updatedAt: ({ updatedAt }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((date) => date.toISOString())
        .pipe(updatedAt)
        .optional(),
  }
);
export const selectServiceAvailabilitySchema = createSelectSchema(
  serviceAvailabilityTable,
  {
    createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
    date: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
    endTime: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
    startTime: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
    updatedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  }
);
export const requestServiceAvailabilitySchema = createInsertSchema(
  serviceAvailabilityTable
).omit({ adminId: true });

export type InsertServiceAvailability =
  typeof serviceAvailabilityTable.$inferInsert;
export type SelectServiceAvailability =
  typeof serviceAvailabilityTable.$inferSelect;
export type RequestServiceAvailability = Omit<
  InsertServiceAvailability,
  'id' | 'adminId'
>;

export const recurringAvailabilityTable = pgTable('recurring_availability', {
  adminId: uuid('admin_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  dayOfWeek: text('day_of_week').notNull(),
  endDate: time('end_time'),
  id: uuid('id').defaultRandom().primaryKey(),
  serviceType: pgServiceTypes('service_type').notNull(),
  startDate: date('start_date').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertRecurringAvailabilitySchema = createInsertSchema(
  recurringAvailabilityTable
);
export const selectRecurringAvailabilitySchema = createSelectSchema(
  recurringAvailabilityTable
);

export type InsertRecurringAvailability =
  typeof insertRecurringAvailabilitySchema;
export type SelectRecurringAvailability =
  typeof selectRecurringAvailabilitySchema;
