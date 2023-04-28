CREATE TABLE `notifications` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`github_action` enum('follow','star','share'),
	`repo_name` varchar(256),
	`post_action` enum('comment','like'),
	`post_id` varchar(191),
	`origin_id` varchar(191) NOT NULL,
	`receiver_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `receiver_id_idx` ON `notifications` (`receiver_id`);