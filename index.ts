import 'dotenv/config';
import { startServer } from './src/server/index.js';

startServer().catch(err => {
  console.error('Failed to start server:', err);
});