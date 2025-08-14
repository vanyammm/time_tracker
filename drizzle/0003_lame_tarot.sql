PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`avatar_gradient` text NOT NULL,
	`daily_goal_minutes` integer NOT NULL,
	`coins` integer DEFAULT 900 NOT NULL,
	`created_at` integer DEFAULT '"2025-07-22T16:44:24.756Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "password_hash", "avatar_gradient", "daily_goal_minutes", "coins", "created_at") SELECT "id", "username", "password_hash", "avatar_gradient", "daily_goal_minutes", "coins", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
ALTER TABLE `challenges` ADD `end_date` integer;
UPDATE `challenges` SET `end_date` = strftime('%s', datetime(start_date, 'unixepoch', '+' || days_amount || ' days')) WHERE `days_amount` IS NOT NULL;