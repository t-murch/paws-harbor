DO $$ BEGIN
 CREATE TYPE "public"."sizes" AS ENUM('giant', 'large', 'medium', 'small');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "size" "sizes" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN IF EXISTS "weight";