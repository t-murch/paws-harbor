import {
  durationUnit,
  PersistedServiceConfig,
  ServicePricing,
} from "../../server";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

/**
 * PRICING
 */
// Pricing model validation schemas
const baseRatePricingSchema = z.object({
  additionalPrice: z.number().or(z.string().pipe(z.coerce.number())),
  additionalTime: z.number().or(z.string().pipe(z.coerce.number())),
  addons: z.record(z.string(), z.number()),
  basePrice: z.number().or(z.string().pipe(z.coerce.number())),
  baseTime: z.number().or(z.string().pipe(z.coerce.number())),
  timeUnit: z.enum(["mins", "hours", "days"]),
  type: z.literal("baseRate"),
});

const tieredPricingSchema = z.object({
  tierMapping: z.array(
    z.object({
      criteria: z.string(),
      description: z.string(),
    }),
  ),
  tiers: z.record(z.string(), z.number()),
  type: z.literal("tiered"),
});

const servicePricingSchema = z.discriminatedUnion("type", [
  baseRatePricingSchema,
  tieredPricingSchema,
]);

export const pgDurationUnit = pgEnum("duration_unit", ["hour(s)", "day(s)"]);

export const servicesTable = pgTable("services", {
  // ** ADD THIS TO BOOKING TABLE
  // SERVICES HAVE NO OWNERS
  // ownerId: uuid('user_id').references(() => profilesTable.id, {
  //   onDelete: 'cascade',
  // }),
  // walkerId: uuid('user_id').references(() => profilesTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  isBase: boolean("is_base").notNull().default(false),
  metadata: jsonb("metadata").notNull().$type<Record<string, unknown>>(),
  name: text("name").notNull(),
  pricingModel: jsonb("pricing_model").notNull().$type<ServicePricing>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type NewService = typeof servicesTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type AllServices = NewService | Service;

export const hours = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
] as const;
export const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;
export type duration =
  | `${(typeof hours)[number]} ${(typeof durationUnit)[0]}`
  | `${(typeof days)[number]} ${(typeof durationUnit)[1]}`;

export const InsertServiceSchema = createInsertSchema(servicesTable, {
  createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  metadata: z.record(z.string(), z.unknown()),
  pricingModel: servicePricingSchema,
  updatedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
});

export const SelectServiceSchema = createSelectSchema(servicesTable, {
  createdAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  metadata: z.record(z.string(), z.unknown()),
  pricingModel: servicePricingSchema,
  updatedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
});

// Example usage with your existing types
export function mapDbToServiceConfig(
  dbService: Service,
): PersistedServiceConfig {
  return {
    description: dbService.description,
    id: dbService.id,
    isBase: dbService.isBase,
    metadata: dbService.metadata,
    name: dbService.name,
    pricingModel: dbService.pricingModel, // Automatically typed as ServicePricing
  };
}
