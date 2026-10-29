
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

// Validate and normalize request bodies using the supplied Zod schema.
export const validateRequestBody =
    (schema: z.ZodType) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid request body.',
                error: result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            });
            return;
        }

        req.body = result.data;
        next();
    };
