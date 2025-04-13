ALTER TABLE "merchant_table" RENAME COLUMN "username" TO "merchant_username";--> statement-breakpoint
ALTER TABLE "merchant_table" ADD COLUMN "prefer_xsgd" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_table" ADD COLUMN "currency" text NOT NULL;