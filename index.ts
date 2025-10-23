import "dotenv/config";
import { startServer } from "./src/server/index.js";
import { logger } from "./src/common/logger";

const shouldAutostart = process.env.TFGQL_SKIP_AUTOSTART !== "1";

if (!shouldAutostart) {
  logger.warn(
    { reason: "TFGQL_SKIP_AUTOSTART set" },
    "Skipping automatic server start",
  );
} else {
  startServer().catch((err) => {
    logger.error({ err }, "Failed to start server");
  });
}
