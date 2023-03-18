/*
  Warnings:

  - You are about to drop the `PendingRelations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnRelations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PendingRelations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserOnRelations";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_UserPending" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserPending_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("handle") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserPending_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("handle") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserPending_AB_unique" ON "_UserPending"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPending_B_index" ON "_UserPending"("B");
