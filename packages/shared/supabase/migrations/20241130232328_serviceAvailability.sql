CREATE TABLE IF NOT EXISTS "recurring_availability" (
	"admin_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"day_of_week" text NOT NULL,
	"end_time" time NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type" "service_type" NOT NULL,
	"start_date" date NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_availability" (
	"admin_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"date" date NOT NULL,
	"end_time" time NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type" "service_type" NOT NULL,
	"start_time" time NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recurring_availability" ADD CONSTRAINT "recurring_availability_admin_id_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_availability" ADD CONSTRAINT "service_availability_admin_id_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
