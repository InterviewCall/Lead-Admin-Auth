import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../repository/user.repository.js';
import type { AuthRequest } from '../types/AuthRequest.js';
import { verifyAccessToken, verifyPasswordResetToken } from '../utils/auth/auth.js';
import { UnauthorizedError } from '../utils/errors/app.error.js';

const userRepository = new UserRepository();

// Verify the token and current database state before allowing the request.
const authenticateToken = async (req: Request, next: NextFunction, tokenType: 'access' | 'password_reset'): Promise<void> => {
    const authHeader = req.headers.authorization;
const tokenMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
const bearerToken = tokenMatch?.[1]?.trim();

const cookieToken = req.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('auth_token='))
    ?.slice('auth_token='.length);

const token = bearerToken || cookieToken;
    if (!token) {
        next(new UnauthorizedError('A valid bearer token is required.'));
        return;
    }

    try {
        const payload = tokenType === 'access' ? verifyAccessToken(token) : verifyPasswordResetToken(token);

        // A JWT can remain valid even after an admin deactivates a user.
        // So, we check the user's latest account status in the database
        // before allowing access to any protected endpoint.
        const user = await userRepository.findByPublicId(payload.sub);

        if (!user) {
            throw new UnauthorizedError('Account not found.');
        }

        const role = user.role.name;

        if (tokenType === 'access') {
            if (!user.isActive || user.passwordResetRequired || payload.role !== role) {
                throw new UnauthorizedError('This account cannot access the requested resource.');
            }
        } else if (user.isActive || !user.passwordResetRequired) {
            throw new UnauthorizedError('Password reset is not required or is no longer allowed.');
        }

        (req as AuthRequest).auth = payload;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('Token expired. Please sign in again.'));
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid token or token purpose.'));
            return;
        }

        next(error);
    }
};

// Allow normal access only if the account is active,
// no password reset is pending, and the role in the token
// matches the user's current role in the database.
export const authenticateUser = (req: Request, _res: Response, next: NextFunction): void => {
    void authenticateToken(req, next, 'access');
};

// Allow password reset only for inactive accounts that still
// require a password change. This allows a newly created manager
// to replace the temporary password, but prevents users from
// using the reset flow after their account has been activated
// or an admin has deactivated an already activated account.
export const requirePasswordResetToken = (req: Request, _res: Response, next: NextFunction): void => {
    void authenticateToken(req, next, 'password_reset');
};
