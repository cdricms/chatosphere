-- CreateTable
CREATE TABLE "PendingRelations" (
    "pendingHandle" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "PendingRelations_pendingHandle_fkey" FOREIGN KEY ("pendingHandle") REFERENCES "User" ("handle") ON DELETE RESTRICT ON UPDATE CASCADE
);
