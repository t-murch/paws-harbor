ALTER TYPE "service_frequency" ADD VALUE 'daily';--> statement-breakpoint
ALTER TYPE "service_frequency" ADD VALUE 'weekly';--> statement-breakpoint
ALTER TYPE "service_frequency" ADD VALUE 'monthly';--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "duration" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "duration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "description" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "notes";