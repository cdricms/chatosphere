/*
  Warnings:

  - You are about to drop the `UserContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserContact";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "handle" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    CONSTRAINT "User_handle_fkey" FOREIGN KEY ("handle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("handle", "nickname", "profilePicture") SELECT "handle", "nickname", "profilePicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
