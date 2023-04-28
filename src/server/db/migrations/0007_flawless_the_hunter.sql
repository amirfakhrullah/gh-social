CREATE TABLE `chats` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`sender_id` varchar(191) NOT NULL,
	`receiver_id` varchar(191) NOT NULL,
	`content` text NOT NULL
);

CREATE INDEX `sender_id_receiver_id_idx` ON `chats` (`sender_id`,`receiver_id`);
CREATE UNIQUE INDEX `sender_id_receiver_id_unique_idx` ON `chats` (`sender_id`,`receiver_id`);