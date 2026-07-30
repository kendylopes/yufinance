CREATE TYPE "public"."financial_account_type" AS ENUM('CHECKING', 'SAVINGS', 'DIGITAL', 'WALLET', 'CASH');--> statement-breakpoint
CREATE TABLE "financial_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"type" "financial_account_type" NOT NULL,
	"initial_balance" numeric(19, 4) DEFAULT '0' NOT NULL,
	"currency" char(3) NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "financial_accounts_name_length_check" CHECK (char_length(trim("financial_accounts"."name")) >= 2),
	CONSTRAINT "financial_accounts_currency_format_check" CHECK ("financial_accounts"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
ALTER TABLE "financial_accounts" ADD CONSTRAINT "financial_accounts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "financial_accounts_workspace_id_idx" ON "financial_accounts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "financial_accounts_workspace_archived_at_idx" ON "financial_accounts" USING btree ("workspace_id","archived_at");