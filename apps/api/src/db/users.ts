import { ServiceFrequencyEnum, ServiceTypesEnum } from "@/types";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import z from "zod";

export const profilesTable = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  address: text("address"),
  role: text("role").notNull().default("owner"),
  phoneNumber: varchar("phone_number", { length: 15 }),
  profilePictureUrl: text("url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
export const profileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  address: z.string().nullable(),
  name: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  role: z.enum(["walker", "owner"]),
  profilePictureUrl: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// export const PostProfileSchema = z.object();

export const pgServiceTypes = pgEnum("service_type", ServiceTypesEnum.options);
export const pgServiceFrequency = pgEnum(
  "service_frequency",
  ServiceFrequencyEnum.options,
);
