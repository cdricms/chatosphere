/*
  Warnings:

  - You are about to drop the `UserOnRelations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserOnRelations";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserContactRequest" (
    "contactHandle" TEXT NOT NULL,
    "userHandle" TEXT NOT NULL,

    PRIMARY KEY ("contactHandle", "userHandle"),
    CONSTRAINT "UserContactRequest_contactHandle_fkey" FOREIGN KEY ("contactHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserContactRequest_userHandle_fkey" FOREIGN KEY ("userHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);
