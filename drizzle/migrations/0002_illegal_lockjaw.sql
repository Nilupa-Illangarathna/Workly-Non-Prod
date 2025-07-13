ALTER TABLE "partner_withdrawals" ADD COLUMN "method_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_withdrawals" ADD CONSTRAINT "partner_withdrawals_method_id_payment_methods_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_withdrawals" DROP COLUMN "method";--> statement-breakpoint
ALTER TABLE "partner_withdrawals" DROP COLUMN "transaction_id";