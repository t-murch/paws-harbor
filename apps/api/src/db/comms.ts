import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profilesTable } from "./users";
import { petServicesTable } from "./services";
import { petsTable } from "./pets";

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
