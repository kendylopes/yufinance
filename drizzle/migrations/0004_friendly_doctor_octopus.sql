CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"planned_amount" numeric(19, 4) NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "budgets_month_range_check" CHECK ("budgets"."month" >= 1 and "budgets"."month" <= 12),
	CONSTRAINT "budgets_year_positive_check" CHECK ("budgets"."year" >= 2000),
	CONSTRAINT "budgets_planned_amount_positive_check" CHECK ("budgets"."planned_amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "budgets_workspace_id_idx" ON "budgets" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "budgets_category_id_idx" ON "budgets" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "budgets_workspace_period_idx" ON "budgets" USING btree ("workspace_id","year","month");--> statement-breakpoint
CREATE INDEX "budgets_workspace_archived_at_idx" ON "budgets" USING btree ("workspace_id","archived_at");--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_workspace_category_year_month_unique_idx" ON "budgets" USING btree ("workspace_id","category_id","year","month");