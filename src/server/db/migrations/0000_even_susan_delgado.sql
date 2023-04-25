CREATE TABLE `comments` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `likes` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `posts` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`owner_id` varchar(191) NOT NULL,
	`content` text NOT NULL,
	`repo_shared` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `owner_id_idx` ON `comments` (`owner_id`);
CREATE INDEX `post_id_idx` ON `comments` (`id`);
CREATE INDEX `owner_id_idx` ON `likes` (`owner_id`);
CREATE INDEX `post_id_idx` ON `likes` (`id`);
CREATE INDEX `owner_id_idx` ON `posts` (`owner_id`);