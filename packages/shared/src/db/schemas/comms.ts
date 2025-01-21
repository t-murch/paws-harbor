import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profilesTable } from './users';
import { servicesTable } from './services';
import { petsTable } from './pets';

export const bookings = pgTable('bookings', {
  endTime: timestamp('end_time').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  notes: text('notes'), // Additional notes for the booking
  petId: uuid('pet_id').references(() => petsTable.id, { onDelete: 'cascade' }), // The pet being serviced
  price: integer('price').notNull(), // Total price for the booking
  serviceId: uuid('service_id').references(() => servicesTable.id, {
    onDelete: 'cascade',
  }), // The service being booked
  startTime: timestamp('start_time').notNull(),
  status: text('status').notNull(), // Use BookingStatus enum in TypeScript
  userId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // Pet Owner
  walkerId: uuid('walker_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // Dog Walker or Pet Sitter
});

export const reviews = pgTable('reviews', {
  bookingId: uuid('booking_id').references(() => bookings.id, {
    onDelete: 'cascade',
  }), // Associated booking
  comments: text('comments'), // Optional review text
  createdAt: timestamp('created_at').defaultNow(), // Review creation date
  id: uuid('id').defaultRandom().primaryKey(),
  rating: integer('rating').notNull(), // Rating between 1 and 5
  userId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // User who made the review
});

export const messages = pgTable('messages', {
  bookingId: uuid('booking_id').references(() => bookings.id, {
    onDelete: 'cascade',
  }), // Optional: link message to a booking
  content: text('content').notNull(), // The message text
  createdAt: timestamp('created_at').defaultNow(), // Message timestamp
  id: uuid('id').defaultRandom().primaryKey(),
  receiverId: uuid('receiver_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // Receiver
  senderId: uuid('sender_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // Sender
});

export const notifications = pgTable('notifications', {
  createdAt: timestamp('created_at').defaultNow(), // Notification timestamp
  id: uuid('id').defaultRandom().primaryKey(),
  isRead: boolean('is_read').default(false), // Track if the user has read the notification
  message: text('message').notNull(), // Notification message
  type: text('type').notNull(), // Use NotificationType enum in TypeScript
  userId: uuid('user_id').references(() => profilesTable.id, {
    onDelete: 'cascade',
  }), // Recipient of the notification
});
