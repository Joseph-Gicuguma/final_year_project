/*
  Warnings:

  - You are about to alter the column `date` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `to_date` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `date` TIMESTAMP NOT NULL,
    MODIFY `to_date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `alika_event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    `time` VARCHAR(10) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `host_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
    `updated_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alika_invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `guestEmail` VARCHAR(255) NOT NULL,
    `guestName` VARCHAR(255) NOT NULL,
    `status` ENUM('pending', 'accepted', 'declined', 'maybe') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
    `updated_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alika_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `type` ENUM('google_photos', 'spotify') NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alika_event` ADD CONSTRAINT `alika_event_host_id_fkey` FOREIGN KEY (`host_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alika_invitation` ADD CONSTRAINT `alika_invitation_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `alika_event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alika_media` ADD CONSTRAINT `alika_media_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `alika_event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
