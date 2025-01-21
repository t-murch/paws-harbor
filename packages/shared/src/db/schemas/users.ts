import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import z from "zod";
import { ServiceFrequencyEnum, ServiceTypesEnum } from "../../server";

export const profilesTable = pgTable("profiles", {
  address: text("address"),
  admin: boolean("admin").default(false),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  email: text("email").notNull().unique(),
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  phoneNumber: varchar("phone_number", { length: 15 }),
  profilePictureUrl: text("url"),
  role: text("role").notNull().default("owner"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
export const profileSchema = z.object({
  address: z.string().nullable(),
  admin: z.boolean().optional(),
  bio: z.string().nullable(),
  createdAt: z.string().datetime(),
  email: z.string().email(),
  id: z.string(),
  name: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  profilePictureUrl: z.string().nullable(),
  role: z.enum(["walker", "owner"]),
  updatedAt: z.string().datetime(),
});

// export const PostProfileSchema = z.object();

export const pgServiceTypes = pgEnum("service_type", ServiceTypesEnum.options);
export const pgServiceFrequency = pgEnum(
  "service_frequency",
  ServiceFrequencyEnum.options,
);
