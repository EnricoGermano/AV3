/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `aircraft` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `aircraft` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `aircraft` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alcance` to the `aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacidade` to the `aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelo` to the `aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `aircraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aircraft` DROP COLUMN `manufacturer`,
    DROP COLUMN `name`,
    ADD COLUMN `alcance` INTEGER NOT NULL,
    ADD COLUMN `capacidade` INTEGER NOT NULL,
    ADD COLUMN `codigo` VARCHAR(191) NOT NULL,
    ADD COLUMN `modelo` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipo` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tests` MODIFY `descricao` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `aircraft_codigo_key` ON `aircraft`(`codigo`);
