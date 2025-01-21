DO $$ BEGIN
 CREATE TYPE "public"."duration_unit" AS ENUM('hour(s)', 'day(s)');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "duration_unit" "duration_unit" NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "duration_value" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "duration";