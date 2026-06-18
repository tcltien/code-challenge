import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${req.method} ${req.path} - ${err.message}`, {
        stack: err.stack,
        body: req.body,
        params: req.params
    });
    const status = err.status || 500;
    const message = status === 500 ? 'An unexpected error occurred.' : err.message;
    res.status(status).json({ error: message });
};