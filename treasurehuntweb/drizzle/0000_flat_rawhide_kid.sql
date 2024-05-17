CREATE TABLE IF NOT EXISTS "treasurehunt_projectObjectives" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"title" varchar NOT NULL,
	"order" integer NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"clue-message" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "treasurehunt_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"projectDescription" text,
	"userId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "treasurehunt_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"password" text NOT NULL,
	CONSTRAINT "treasurehunt_user_id_unique" UNIQUE("id"),
	CONSTRAINT "treasurehunt_user_email_unique" UNIQUE("email")
);
