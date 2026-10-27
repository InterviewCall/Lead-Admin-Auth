import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import {
    JWT_SECRET,
    JWT_ISSUER,
    JWT_AUDIENCE,
    JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS,
} from '../../configs/server.config.js';

import type {
    AdminRole,
    AccessTokenPayload,
    PasswordResetTokenPayload,
} from '../../types/UserTokenPayload.js';

// Validate the JWT secret before using it.
function getJwtSecret(): string {
    if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET, 'utf8') < 32) {
        throw new Error('JWT_SECRET must contain at least 32 bytes of random data.');
    }

    return JWT_SECRET;
}

// Hash and verify passwords using Argon2id.
export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
}

export async function checkPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
}

const tokenOptions = {
    algorithm: 'HS256' as const,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
};

// Create a normal access token.
export function createAccessToken(
    publicId: string,
    role: AdminRole
): string {
    return jwt.sign(
        { role, tokenType: 'access' },
        getJwtSecret(),
        {
            ...tokenOptions,
            subject: publicId,
            expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
        }
    );
}

// Create a short-lived password-reset token.
export function createPasswordResetToken(publicId: string): string {
    return jwt.sign(
        { tokenType: 'password_reset' },
        getJwtSecret(),
        {
            ...tokenOptions,
            subject: publicId,
            expiresIn: JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS,
        }
    );
}

// Verify the token's signature, expiry, issuer, audience and purpose.
function verifyToken(
    token: string,
    expectedType: 'access' | 'password_reset'
): JwtPayload & { sub: string; tokenType: string } {
    const payload = jwt.verify(token, getJwtSecret(), {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });

    if (
        typeof payload === 'string' ||
        typeof payload.sub !== 'string' ||
        !payload.sub ||
        payload.tokenType !== expectedType
    ) {
        throw new jwt.JsonWebTokenError('Invalid token or token purpose.');
    }

    return payload as JwtPayload & { sub: string; tokenType: string };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    const payload = verifyToken(token, 'access');

    if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
        throw new jwt.JsonWebTokenError('Invalid token or token purpose.');
    }

    return payload as AccessTokenPayload;
}

export function verifyPasswordResetToken(
    token: string
): PasswordResetTokenPayload {
    return verifyToken(token, 'password_reset') as PasswordResetTokenPayload;
}