ALTER TABLE "services" DROP CONSTRAINT "services_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "user_id";