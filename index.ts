import 'dotenv/config';
import { startServer } from './src/server/index.js';
import { logger } from './src/common/logger';

startServer().catch(err => {
  logger.error({ err }, 'Failed to start server');
});
