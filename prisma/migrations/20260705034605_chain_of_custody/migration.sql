-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoundItem" (
    "foundItemId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "itemName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationFound" TEXT NOT NULL,
    "dateFound" DATETIME NOT NULL,
    "imagePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custody" TEXT NOT NULL DEFAULT 'with_finder',
    "adminMessage" TEXT,
    CONSTRAINT "FoundItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FoundItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("categoryId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoundItem" ("categoryId", "createdAt", "dateFound", "description", "foundItemId", "imagePath", "itemName", "locationFound", "status", "userId") SELECT "categoryId", "createdAt", "dateFound", "description", "foundItemId", "imagePath", "itemName", "locationFound", "status", "userId" FROM "FoundItem";
DROP TABLE "FoundItem";
ALTER TABLE "new_FoundItem" RENAME TO "FoundItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
