CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"financial_account_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"type" "category_type" NOT NULL,
	"description" varchar(120) NOT NULL,
	"amount" numeric(19, 4) NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"notes" text,
	"canceled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_description_length_check" CHECK (char_length(trim("transactions"."description")) >= 2),
	CONSTRAINT "transactions_amount_positive_check" CHECK ("transactions"."amount" > 0)
);
--> statement-breakpoint
DROP INDEX "categories_workspace_type_name_unique_idx";--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_financial_account_id_financial_accounts_id_fk" FOREIGN KEY ("financial_account_id") REFERENCES "public"."financial_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_workspace_id_idx" ON "transactions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "transactions_workspace_occurred_at_idx" ON "transactions" USING btree ("workspace_id","occurred_at");--> statement-breakpoint
CREATE INDEX "transactions_workspace_canceled_at_idx" ON "transactions" USING btree ("workspace_id","canceled_at");--> statement-breakpoint
CREATE INDEX "transactions_financial_account_id_idx" ON "transactions" USING btree ("financial_account_id");--> statement-breakpoint
CREATE INDEX "transactions_category_id_idx" ON "transactions" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_workspace_type_name_unique_idx" ON "categories" USING btree ("workspace_id","type",lower(trim("name")));--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_length_check" CHECK (char_length(trim("categories"."name")) >= 2);