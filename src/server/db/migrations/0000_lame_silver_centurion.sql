DO $$ BEGIN
 CREATE TYPE "github_action" AS ENUM('follow', 'star', 'share');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "post_action" AS ENUM('comment', 'like');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"owner_id" varchar(191) NOT NULL,
	"content" text NOT NULL,
	"post_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"owner_id" varchar(191) NOT NULL,
	"post_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"github_action" "github_action",
	"repo_name" varchar(256),
	"post_action" "post_action",
	"post_id" varchar(191),
	"comment_id" varchar(191),
	"origin_id" varchar(191) NOT NULL,
	"receiver_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"owner_id" varchar(191) NOT NULL,
	"content" text NOT NULL,
	"repo_shared" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_owner_id_idx" ON "comments" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_owner_id_idx" ON "likes" ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "likes_unique_idx" ON "likes" ("post_id","owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_receiver_id_idx" ON "notifications" ("receiver_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_owner_id_idx" ON "posts" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_repo_shared_idx" ON "posts" ("repo_shared");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
