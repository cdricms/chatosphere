/*
  Warnings:

  - You are about to drop the `_UserPending` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserPending";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserOnRelations" (
    "relationHandle" TEXT NOT NULL,
    "userHandle" TEXT NOT NULL,

    PRIMARY KEY ("relationHandle", "userHandle"),
    CONSTRAINT "UserOnRelations_relationHandle_fkey" FOREIGN KEY ("relationHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserOnRelations_userHandle_fkey" FOREIGN KEY ("userHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);
