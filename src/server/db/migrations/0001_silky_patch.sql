ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_comment_id_comments_id_fk";
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_post_id_idx" ON "comments" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_post_id_idx" ON "likes" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_post_id_idx" ON "notifications" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_comment_id_idx" ON "notifications" ("post_id");