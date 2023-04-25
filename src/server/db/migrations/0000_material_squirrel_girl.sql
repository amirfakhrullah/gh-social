CREATE TABLE `comments` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `likes` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`repo_shared` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE INDEX `owner_id_idx` ON `comments` (`owner_id`);
CREATE INDEX `post_id_idx` ON `comments` (`id`);
CREATE INDEX `owner_id_idx` ON `likes` (`owner_id`);
CREATE INDEX `post_id_idx` ON `likes` (`id`);
CREATE INDEX `owner_id_idx` ON `posts` (`owner_id`);