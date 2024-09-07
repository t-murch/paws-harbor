import {
  PetSpeciesEnum,
  ServiceFrequencyEnum,
  ServiceTypesEnum,
} from "@/types";
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const profilesTable = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
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

const pgServices = pgEnum("services", ServiceTypesEnum.options);
const pgFrequencies = pgEnum("frequency", ServiceFrequencyEnum.options);

export const petServicesTable = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
  walkerId: uuid("user_id").references(() => profilesTable.id),
  duration: integer("duration"),
  price: integer("price"),
  type: pgServices("services").notNull(),
  frequency: pgFrequencies("frequency").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertPet = typeof petsTable.$inferInsert;
export type SelectPet = typeof petsTable.$inferSelect;

const pgSpecies = pgEnum("species", PetSpeciesEnum.options);

export const petsTable = pgTable("pets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  species: pgSpecies("species").notNull(),
  breed: text("breed"),
  age: integer("age"),
  weight: decimal("weight"),
  specialNeeds: text("special_needs"),
});

export type InsertService = typeof petServicesTable.$inferInsert;
export type SelectService = typeof petServicesTable.$inferSelect;

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // Pet Owner
  walkerId: uuid("walker_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // Dog Walker or Pet Sitter
  serviceId: uuid("service_id").references(() => petServicesTable.id, {
    onDelete: "cascade",
  }), // The service being booked
  petId: uuid("pet_id").references(() => petsTable.id, { onDelete: "cascade" }), // The pet being serviced
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull(), // Use BookingStatus enum in TypeScript
  notes: text("notes"), // Additional notes for the booking
  price: integer("price").notNull(), // Total price for the booking
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }), // Associated booking
  userId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // User who made the review
  rating: integer("rating").notNull(), // Rating between 1 and 5
  comments: text("comments"), // Optional review text
  createdAt: timestamp("created_at").defaultNow(), // Review creation date
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // Sender
  receiverId: uuid("receiver_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // Receiver
  bookingId: uuid("booking_id").references(() => bookings.id, {
    onDelete: "cascade",
  }), // Optional: link message to a booking
  content: text("content").notNull(), // The message text
  createdAt: timestamp("created_at").defaultNow(), // Message timestamp
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profilesTable.id, {
    onDelete: "cascade",
  }), // Recipient of the notification
  type: text("type").notNull(), // Use NotificationType enum in TypeScript
  message: text("message").notNull(), // Notification message
  isRead: boolean("is_read").default(false), // Track if the user has read the notification
  createdAt: timestamp("created_at").defaultNow(), // Notification timestamp
});
