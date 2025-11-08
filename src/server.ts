import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./config/database.js";
import logger from "./utils/logger.util.js";
import fs from "fs";

const PORT = env.PORT;

async function startServer() {
  try {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", { recursive: true });
      logger.info("Uploads folder created");
    }

    await prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info("Server started", {
        port: PORT,
        environment: env.NODE_ENV,
        url: `http://localhost:${PORT}`,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", { error });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  process.exit(1);
});

startServer();
