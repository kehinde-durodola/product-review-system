import prisma from "../src/config/database.js";
import { hashPassword } from "../src/utils/password.util.js";

async function main() {
  console.log("Starting database seed...");

  const hashedPassword = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
      isVerified: true,
      isBanned: false,
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("Email: admin@example.com");
  console.log("Password: admin123");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
