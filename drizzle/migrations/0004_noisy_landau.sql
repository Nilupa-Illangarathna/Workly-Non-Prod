ALTER TABLE "kyc" ALTER COLUMN "idback" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fullname" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "postalcode" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kyc" ADD COLUMN "type" text NOT NULL;