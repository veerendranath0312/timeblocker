CREATE TABLE "daily_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"shutdown_complete" boolean DEFAULT false NOT NULL,
	"deep_hours" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"date" date NOT NULL,
	"resource_id" varchar(50) NOT NULL,
	"color" varchar(100) NOT NULL,
	"is_crossed_off" boolean DEFAULT false NOT NULL,
	"is_editable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replan_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"resource_id" varchar(50) NOT NULL,
	"replan_time" time NOT NULL,
	"previous_resource_id" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"google_id" varchar(255),
	"github_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
ALTER TABLE "daily_metrics" ADD CONSTRAINT "daily_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replan_history" ADD CONSTRAINT "replan_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_daily_metrics_user_date_unique" ON "daily_metrics" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_daily_metrics_user_id" ON "daily_metrics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_daily_metrics_date" ON "daily_metrics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_events_user_date" ON "events" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_events_user_resource" ON "events" USING btree ("user_id","resource_id");--> statement-breakpoint
CREATE INDEX "idx_events_date" ON "events" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notes_user_date_unique" ON "notes" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_notes_user_id" ON "notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notes_date" ON "notes" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_replan_user_date" ON "replan_history" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_replan_date" ON "replan_history" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_date" ON "tasks" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_id" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_date" ON "tasks" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_google_id" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "idx_users_github_id" ON "users" USING btree ("github_id");