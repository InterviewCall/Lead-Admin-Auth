
import type { JwtPayload } from 'jsonwebtoken';

export type AdminRole = 'ADMIN' | 'MANAGER';

export type AccessTokenPayload = JwtPayload & {
    sub: string;
    role: AdminRole;
    tokenType: 'access';
};

export type PasswordResetTokenPayload = JwtPayload & {
    sub: string;
    tokenType: 'password_reset';
};
