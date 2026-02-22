
import app from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';
import { prisma } from './prisma/index.js';
import { createServer } from 'http';
import { setupWebSocket } from './lib/websocket.js';

const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Connected to PostgreSQL');

        const httpServer = createServer(app);
        
        (global as unknown as { httpServer: typeof httpServer }).httpServer = httpServer;
        
        setupWebSocket(httpServer);
        logger.info('WebSocket server initialized');

        httpServer.listen(Number(config.port), '0.0.0.0', () => {
            logger.info(`Server running on http://0.0.0.0:${config.port} in ${config.env} mode`);
        });
    } catch (error) {
        logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};

startServer();
