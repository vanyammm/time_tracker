PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_challenge_invites` (
	`challenge_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`receiver_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	PRIMARY KEY(`challenge_id`, `receiver_id`),
	FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_challenge_invites`("challenge_id", "sender_id", "receiver_id", "status") SELECT "challenge_id", "sender_id", "receiver_id", "status" FROM `challenge_invites`;--> statement-breakpoint
DROP TABLE `challenge_invites`;--> statement-breakpoint
ALTER TABLE `__new_challenge_invites` RENAME TO `challenge_invites`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`avatar_gradient` text NOT NULL,
	`daily_goal_minutes` integer NOT NULL,
	`coins` integer DEFAULT 900 NOT NULL,
	`daily_progress` integer DEFAULT 0 NOT NULL,
	`weekly_progress` integer DEFAULT 0 NOT NULL,
	`last_progress_update` integer,
	`created_at` integer DEFAULT '"2025-08-03T17:36:13.277Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "password_hash", "avatar_gradient", "daily_goal_minutes", "coins", "daily_progress", "weekly_progress", "last_progress_update", "created_at") SELECT "id", "username", "password_hash", "avatar_gradient", "daily_goal_minutes", "coins", "daily_progress", "weekly_progress", "last_progress_update", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);