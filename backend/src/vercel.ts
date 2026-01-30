import createApp from './app.js';
import PrismaConfig from './config/database.js';

// Initialize Prisma Client
PrismaConfig.getInstance();

const app = createApp();

export default app;
