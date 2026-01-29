import createApp from './app';
import PrismaConfig from './config/database';

// Initialize Prisma Client
PrismaConfig.getInstance();

const app = createApp();

export default app;
