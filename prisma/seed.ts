import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Pass the database connection directly into the adapter
const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

// Construct PrismaClient using the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaultCategories = [
    "Electronics",
    "Identification Documents",
    "Books/Stationery",
    "Clothing",
    "Keys",
    "Wallets/Purses",
    "Other",
  ];

  console.log("Seeding item categories...");

  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { categoryName: name },
      update: {},
      create: { categoryName: name },
    });
  }

  console.log("Categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });