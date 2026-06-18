import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate =
    (schema: z.ZodSchema<any>) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsed = await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                req.body = parsed.body;
                req.query = parsed.query;
                req.params = parsed.params;

                return next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        error: 'Validation Failed',
                        details: error.issues.map((e) => ({
                            path: e.path,
                            message: e.message,
                        })),
                    });
                }
                return next(error);
            }
        };