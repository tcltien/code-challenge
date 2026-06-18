import winston from 'winston';

const env = process.env.NODE_ENV;
const logLevel = process.env.LOG_LEVEL || 'info';

const isTest = env === 'test';
const isDev = env === 'development';

const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
);

export const logger = winston.createLogger({
    level: isTest ? 'silent' : logLevel,

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console({
            silent: isTest,
            format: isDev ? devFormat : winston.format.json(),
        }),

        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
    ],
});