-- CreateTable
CREATE TABLE "UserContact" (
    "contactHandle" TEXT NOT NULL,
    "userHandle" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "UserContact_contactHandle_fkey" FOREIGN KEY ("contactHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserContact_userHandle_fkey" FOREIGN KEY ("userHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);
