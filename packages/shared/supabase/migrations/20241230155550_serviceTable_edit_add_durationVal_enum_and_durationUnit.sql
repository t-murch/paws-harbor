CREATE TYPE "public"."duration" AS ENUM('min', 'mins', 'hour', 'hours', 'day', 'days', 'night', 'week', 'month');--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "duration_unit" "duration";--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "duration_value" integer;