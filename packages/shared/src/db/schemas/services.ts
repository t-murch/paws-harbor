import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { ServicePricingService } from '../../types/servicePricing';

export const hours = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
] as const;
export const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;
export const durationUnit = [
  'min',
  'mins',
  'hour',
  'hours',
  'day',
  'days',
  'night',
  'week',
  'month',
] as const;
export type DurationUnit = (typeof durationUnit)[number];
const DurationUnitEnum = z.enum(durationUnit);
export const pgDuration = pgEnum('duration', DurationUnitEnum.options);
export type duration =
  | `${(typeof hours)[number]} ${(typeof durationUnit)[0]}`
  | `${(typeof days)[number]} ${(typeof durationUnit)[1]}`;

// export const pgDurationUnit = pgEnum('duration_unit', ['hour(s)', 'day(s)']);

export const servicesTable = pgTable('services', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  description: text('description').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  isTiered: boolean('is_tiered').default(false),
  metadata: jsonb('metadata').notNull().$type<Record<string, unknown>>(),
  name: text('name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type NewService = typeof servicesTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type AllServices = NewService | Service;

export const InsertServiceSchema = createInsertSchema(servicesTable, {
  createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  metadata: z.record(z.string(), z.unknown()),
  updatedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
});

export const SelectServiceSchema = createSelectSchema(servicesTable, {
  createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  metadata: z.record(z.string(), z.unknown()),
  updatedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
});
export type SelectServiceT = typeof SelectServiceSchema;

export const pricingTable = pgTable('service_pricing', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  durationUnit: text('duration_unit').notNull(),
  durationValue: integer('duration_value').notNull(),
  id: serial('id').primaryKey(),
  serviceId: uuid('service_id')
    .references(() => servicesTable.id, { onDelete: 'cascade' })
    .notNull(),
  tierLevel: integer('tier_level').notNull(),
  tieredRate: numeric('tiered_rate').notNull(),
});

export const insertPricingSchema = createInsertSchema(pricingTable, {
  createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  serviceId: z.string().uuid().optional(),
});
export const insertPricingSchemaClient = createInsertSchema(pricingTable, {
  serviceId: z.string().uuid().optional(),
});
export type NewPricingInsert = z.infer<typeof insertPricingSchema>;
export const pricingSchema = createSelectSchema(pricingTable);
export type Pricing = typeof pricingTable.$inferSelect;

export type ServicePricingDTO = Service & Pricing;
export const ServicePricingInsertDTOSchema = InsertServiceSchema.extend({
  discounts: z
    .array(
      z.object({
        isApplied: z.boolean(),
        type: z.enum(['percentage', 'fixed']),
        value: z.number().or(z.string().pipe(z.coerce.number())),
      })
    )
    .optional(),
  durationOptions: z.array(insertPricingSchema),
});
export const ServicePricingSelectDTOSchema = SelectServiceSchema.extend({
  discounts: z
    .array(
      z.object({
        isApplied: z.boolean(),
        type: z.enum(['percentage', 'fixed']),
        value: z.number().or(z.string().pipe(z.coerce.number())),
      })
    )
    .optional(),
  durationOptions: z.array(ServicePricingService.DurationOptionSchema),
});
// export const addons = pgTable('addons', {
//   createdAt: timestamp('created_at').defaultNow(),
//   description: text('description'),
//   durationMinutes: integer('duration_minutes').default(0),
//   id: uuid('id').primaryKey(),
//   name: text('name').notNull(),
//   price: numeric('price', { precision: 10, scale: 2 }).notNull(),
//   serviceId: integer('service_id').references(() => servicesTable.id, {
//     onDelete: 'cascade',
//   }),
// });

// export const subscriptions = pgTable('subscriptions', {
//   createdAt: timestamp('created_at').defaultNow(),
//   discountRate: numeric('discount_rate', { precision: 5, scale: 2 }).default(
//     `0`
//   ),
//   endDate: date('end_date').notNull(),
//   id: serial('id').primaryKey(),
//   isActive: boolean('is_active').default(false),
//   maxServices: integer('max_services'),
//   planName: text('plan_name'),
//   serviceId: integer('service_id').references(() => servicesTable.id, {
//     onDelete: 'cascade',
//   }),
//   userId: uuid('user_id').references(() => profilesTable.id, {
//     onDelete: 'cascade',
//   }),
// });
//
// export const bookings = pgTable('bookings', {
//   addonId: integer('addon_id').references(() => addons.id),
//   createdAt: timestamp('created_at').defaultNow(),
//   endTime: timestamp('end_time').notNull(),
//   id: serial('id').primaryKey(),
//   pricingId: integer('pricing_id').references(() => pricingTable.id),
//   serviceId: integer('service_id').references(() => servicesTable.id, {
//     onDelete: 'cascade',
//   }),
//   startTime: timestamp('start_time').notNull(),
//   subscriptionId: integer('subscription_id').references(() => subscriptions.id),
//   totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
//   userId: uuid('user_id').references(() => profilesTable.id, {
//     onDelete: 'cascade',
//   }),
// });
