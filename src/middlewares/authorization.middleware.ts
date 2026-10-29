import type { NextFunction, Request, Response } from 'express';

import type { AuthRequest } from '../types/AuthRequest.js';
import type { AdminRole } from '../types/UserTokenPayload.js';
import { UnauthorizedError } from '../utils/errors/app.error.js';

export const authorizeRole = (...allowedRoles: AdminRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const auth = (req as AuthRequest).auth;

        if (
            !auth ||
            auth.tokenType !== 'access' ||
            !allowedRoles.includes(auth.role)
        ) {
            next(
                new UnauthorizedError(
                    'You are not authorized to perform this action.',
                ),
            );
            return;
        }

        next();
    };
};