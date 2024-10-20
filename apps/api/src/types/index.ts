import z from 'zod';

export type User = {
  id: string; // Unique identifier
  name: string;
  email: string;
  passwordHash: string; // For security, store password hash instead of plain text
  role: 'owner' | 'walker'; // User can be a dog owner or walker
  profilePictureUrl?: string; // Optional profile picture
  phoneNumber?: string; // Optional phone number
  address?: string; // Optional address
  bio?: string; // Optional short bio
  createdAt: Date;
  updatedAt: Date;
};

const petSpecies = ['dog', 'cat'] as const;
export type PetSpecies = (typeof petSpecies)[number];
export const PetSpeciesEnum = z.enum(petSpecies);

export const petSizes = ['giant', 'large', 'medium', 'small'] as const;
export type PetSizes = (typeof petSizes)[number];
export const PetSizesEnum = z.enum(petSizes);

const serviceTypes = ['pet-walking', 'pet-sitting', 'pet-bathing'] as const;
export type ServiceType = (typeof serviceTypes)[number];
export const ServiceTypesEnum = z.enum(serviceTypes);

const serviceFrequencies = ['a-la-carte', 'recurring-monthly'] as const;
export type ServiceFrequency = (typeof serviceFrequencies)[number];
export const ServiceFrequencyEnum = z.enum(serviceFrequencies);

export type Service = {
  id: string; // Unique identifier
  walkerId: string; // Reference to the walker's User ID
  type: ServiceType; // Type of service offered
  description: string; // Description of the service
  duration: number; // Duration in minutes for walks, or days for pet-sitting
  frequency: ServiceFrequency;
  price: number; // Price in the desired currency
  createdAt: Date;
  updatedAt: Date;
};

const bookingStatus = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
] as const;
export type BookingStatus = (typeof bookingStatus)[number];
export const BookingStatusEnum = z.enum(bookingStatus);

export type Booking = {
  id: string; // Unique identifier
  serviceId: string; // Reference to the Service ID
  ownerId: string; // Reference to the owner's User ID
  petId: string; // Reference to the Pet ID
  date: Date; // Date and time of the booking
  status: BookingStatus; // Booking status
  notes?: string; // Optional additional notes
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string; // Unique identifier
  bookingId: string; // Reference to the Booking ID
  reviewerId: string; // Reference to the reviewer's User ID
  rating: number; // Rating out of 5
  comment: string; // Review comment
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id: string; // Unique identifier
  senderId: string; // Reference to the sender's User ID
  receiverId: string; // Reference to the receiver's User ID
  content: string; // Message content
  read: boolean; // Read status
  sentAt: Date; // Timestamp of when the message was sent
  readAt?: Date; // Optional timestamp of when the message was read
};

const notificationType = ['booking', 'review', 'general'] as const;
export type NotificationType = (typeof notificationType)[number];
export const NotificationTypeEnum = z.enum(notificationType);

export type Notification = {
  id: string; // Unique identifier
  userId: string; // Reference to the User ID
  type: NotificationType; // Type of notification
  message: string; // Notification message
  read: boolean; // Read status
  createdAt: Date; // Timestamp of when the notification was created
  readAt?: Date; // Optional timestamp of when the notification was read
};
