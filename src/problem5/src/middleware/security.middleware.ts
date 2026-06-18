import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const securityMiddleware = [
    helmet({
        crossOriginResourcePolicy: false,
    }),

    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
            error: "Too many requests. Please try again later.",
        },
    }),
];