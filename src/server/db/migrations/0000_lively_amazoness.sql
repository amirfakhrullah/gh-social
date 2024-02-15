CREATE TABLE `comments` (
	`id` varchar(191) NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`post_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` varchar(191) NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`post_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `owner_id_post_id_unique_idx` UNIQUE(`post_id`,`owner_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(191) NOT NULL,
	`github_action` enum('follow','star','share'),
	`repo_name` varchar(256),
	`post_action` enum('comment','like'),
	`post_id` varchar(191),
	`comment_id` varchar(191),
	`origin_id` varchar(191) NOT NULL,
	`receiver_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(191) NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`repo_shared` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `owner_id_idx` ON `comments` (`owner_id`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `comments` (`id`);--> statement-breakpoint
CREATE INDEX `owner_id_idx` ON `likes` (`owner_id`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `likes` (`id`);--> statement-breakpoint
CREATE INDEX `receiver_id_idx` ON `notifications` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `owner_id_idx` ON `posts` (`owner_id`);--> statement-breakpoint
CREATE INDEX `repo_shared_idx` ON `posts` (`repo_shared`);