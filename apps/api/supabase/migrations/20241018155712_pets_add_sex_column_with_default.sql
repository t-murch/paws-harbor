ALTER TABLE "pets" ALTER COLUMN "age" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "sex" text DEFAULT 'female';