-- CreateTable
CREATE TABLE "_contacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_contacts_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("handle") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_contacts_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("handle") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "handle" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL
);
INSERT INTO "new_User" ("handle", "nickname", "profilePicture") SELECT "handle", "nickname", "profilePicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_contacts_AB_unique" ON "_contacts"("A", "B");

-- CreateIndex
CREATE INDEX "_contacts_B_index" ON "_contacts"("B");
