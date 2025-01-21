import {
  date,
  pgEnum,
  pgTable,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { pgServiceTypes, profilesTable } from "./users";
import { DaysofWeek, DaysofWeekEnum } from "../../server";

export const serviceAvailabilityTable = pgTable("service_availability", {
  adminId: uuid("admin_id")
    .references(() => profilesTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  date: date("date").notNull(),
  endTime: time("end_time").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  serviceType: pgServiceTypes("service_type").notNull(),
  startTime: time("start_time").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  },
);
export const selectServiceAvailabilitySchema = createSelectSchema(
  serviceAvailabilityTable,
  {
    createdAt: ({ createdAt }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
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
        .pipe(updatedAt)
        .optional(),
  },
);
export const requestServiceAvailabilitySchema =
  insertServiceAvailabilitySchema.omit({ adminId: true });
export const updateServiceAvailabilitySchema = selectServiceAvailabilitySchema
  .partial()
  .required({ id: true });

export type InsertServiceAvailability =
  typeof serviceAvailabilityTable.$inferInsert;
export type SelectServiceAvailability =
  typeof serviceAvailabilityTable.$inferSelect;
export type RequestServiceAvailability = Omit<
  InsertServiceAvailability,
  "id" | "adminId"
>;
export type UpdateServiceAvailability = Partial<SelectServiceAvailability> & {
  id: string;
};

export const pgDaysOfWeek = pgEnum("days_of_week", DaysofWeekEnum.options);

export const recurringAvailabilityTable = pgTable("recurring_availability", {
  adminId: uuid("admin_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  dayOfWeek: pgDaysOfWeek("day_of_week").notNull(),
  endDate: date("end_date"),
  endTime: time("end_time").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  serviceType: pgServiceTypes("service_type").notNull(),
  startDate: date("start_date").notNull(),
  startTime: time("start_time").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecurringAvailabilitySchema = createInsertSchema(
  recurringAvailabilityTable,
  {
    createdAt: ({ createdAt }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((date) => date.toISOString())
        .optional()
        .pipe(createdAt),
    endDate: ({ endDate }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((endDate) => endDate.toISOString())
        .pipe(endDate),
    endTime: ({ endTime }) =>
      z
        .union([z.string(), z.string().time()])
        .pipe(z.coerce.string().time())
        .transform((time) => String(time))
        .pipe(endTime),
    startDate: ({ startDate }) =>
      z
        .union([z.string(), z.date()])
        .pipe(z.coerce.date())
        .transform((endDate) => endDate.toISOString())
        .pipe(startDate),
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
  },
);
export const selectRecurringAvailabilitySchema = createSelectSchema(
  recurringAvailabilityTable,
);
export const updateRecurringAvailabilitySchema =
  selectRecurringAvailabilitySchema.partial().required({ id: true });

export type InsertRecurringAvailability =
  typeof recurringAvailabilityTable.$inferInsert;
export type SelectRecurringAvailability =
  typeof recurringAvailabilityTable.$inferSelect;
export type RequestRecurringServiceAvailability = Omit<
  InsertRecurringAvailability,
  "id" | "adminId"
>;
export type UpdateRecurringAvailability =
  Partial<SelectRecurringAvailability> & {
    id: string;
    dayOfWeek: DaysofWeek;
  };
