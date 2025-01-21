ALTER TABLE "services" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_base" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "metadata" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "pricing_model" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "duration_unit";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "duration_value";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "service_frequency";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "service_type";