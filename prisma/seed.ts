import { PrismaClient } from "@prisma/client";

// Initialize a standard PrismaClient (it will automatically use the DATABASE_URL from your .env)
const prisma = new PrismaClient();

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