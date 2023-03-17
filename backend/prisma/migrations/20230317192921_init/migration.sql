-- CreateTable
CREATE TABLE "UserOnRelations" (
    "relationHandle" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "UserOnRelations_relationHandle_fkey" FOREIGN KEY ("relationHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "handle" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
