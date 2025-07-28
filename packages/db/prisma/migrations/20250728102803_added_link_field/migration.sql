/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - The required column `link` was added to the `Room` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "link" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_link_key" ON "Room"("link");
