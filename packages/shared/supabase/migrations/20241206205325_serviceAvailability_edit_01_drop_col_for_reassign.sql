CREATE TYPE "public"."days_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
ALTER TABLE "recurring_availability" ALTER COLUMN "end_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service_availability" ALTER COLUMN "admin_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service_availability" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service_availability" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_availability" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "recurring_availability" ADD COLUMN "start_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_availability" DROP COLUMN IF EXISTS "day_of_week";