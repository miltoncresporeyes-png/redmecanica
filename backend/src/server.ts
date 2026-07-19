
import 'dotenv/config';
import app from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';
import { prisma } from './prisma/index.js';
import { createServer } from 'http';
import { setupWebSocket } from './lib/websocket.js';

const startServer = async () => {
    try {
        const httpServer = createServer(app);
        
        (global as unknown as { httpServer: typeof httpServer }).httpServer = httpServer;
        
        setupWebSocket(httpServer);
        logger.info('WebSocket server initialized');

        const port = Number(process.env.PORT || config.port || 3011);

        httpServer.listen(port, '0.0.0.0', () => {
            logger.info(`Server running on http://0.0.0.0:${port} in ${config.env} mode`);
        });

        prisma.$connect()
            .then(() => {
                logger.info('Connected to PostgreSQL');
            })
            .catch((dbError) => {
                logger.error({ dbError }, 'Warning: Database connection failed on startup. Server is still running and listening.');
            });
    } catch (error) {
        logger.error({ error }, 'Failed to start HTTP server');
        process.exit(1);
    }
};

startServer();
