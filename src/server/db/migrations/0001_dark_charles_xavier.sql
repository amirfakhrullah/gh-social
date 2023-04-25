ALTER TABLE `comments` MODIFY COLUMN `post_id` varchar(191) NOT NULL;
ALTER TABLE `likes` MODIFY COLUMN `post_id` varchar(191) NOT NULL;