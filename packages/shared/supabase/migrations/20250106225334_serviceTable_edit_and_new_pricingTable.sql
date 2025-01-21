CREATE TABLE IF NOT EXISTS "service_pricing" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"duration_unit" text NOT NULL,
	"duration_value" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" uuid NOT NULL,
	"tier_level" integer NOT NULL,
	"tiered_rate" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_tiered" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_pricing" ADD CONSTRAINT "service_pricing_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "duration_unit";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "duration_value";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "is_base";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "pricing_model";--> statement-breakpoint
DROP TYPE "public"."duration_unit";