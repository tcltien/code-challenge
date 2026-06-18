import dotenv from 'dotenv';
import express from 'express';
import bookRoutes from './routes/book.routes';
import { initDatabase } from './config/db';
import { errorMiddleware } from './middleware/error.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { logger } from './utils/logger';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(securityMiddleware);

// Mount the book routes under the /api/books path
app.use('/api/books', bookRoutes);
app.get("/health", (req, res) => {
    res.json({ ok: true });
});

// Global Error Middleware should be attached after routes
app.use(errorMiddleware);

// Initialize the database and start the server
async function startServer() {
    try {
        await initDatabase();
        logger.info('Database connection established successfully.');
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        logger.error('❌ Failed to start the server:', error);
        process.exit(1);
    }
}
startServer();