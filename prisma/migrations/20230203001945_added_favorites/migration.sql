-- CreateTable
CREATE TABLE `_Favorites` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Favorites_AB_unique`(`A`, `B`),
    INDEX `_Favorites_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_user_id_idx` ON `account`(`user_id`);

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`);
