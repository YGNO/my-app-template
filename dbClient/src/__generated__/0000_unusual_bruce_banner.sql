-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "prefecture" (
	"code" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_kana" text NOT NULL,
	"name_alpha" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prefecture" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "municipality" (
	"prefecture_code" integer NOT NULL,
	"code" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_kana" text NOT NULL,
	"name_alpha" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "municipality" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "municipality" ADD CONSTRAINT "fk_prefecture" FOREIGN KEY ("prefecture_code") REFERENCES "public"."prefecture"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "prefecture_policy" ON "prefecture" AS PERMISSIVE FOR ALL TO "authenticated", "postgres" USING (true);--> statement-breakpoint
CREATE POLICY "municipality_policy" ON "municipality" AS PERMISSIVE FOR ALL TO "authenticated", "postgres" USING (true);
*/