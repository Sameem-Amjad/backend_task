import app from './app.js';
import { ENV } from './constants/ENV.js';
import { logger } from './logger/logger.js';
import prisma from './config/prisma/prisma.js';

const startServer = async () => {
    try {
        // Check DB connection
        await prisma.$connect();
        logger.info('📦 Database connected successfully');

        app.listen(ENV.PORT, () => {
            logger.info(`🚀 Server running on port ${ENV.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();