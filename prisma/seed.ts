import prisma from "../src/config/database.js";
import { hashPassword } from "../src/utils/password.util.js";
import logger from "../src/utils/logger.util.js";

async function main() {
  logger.info("Starting database seed...");

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

  logger.info("Admin user created", { email: admin.email });
  logger.info("Email: admin@example.com");
  logger.info("Password: admin123");
  logger.info("Seed completed successfully!");
}

main()
  .catch((e) => {
    logger.error("Seed failed", { error: e.message });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
