
import type { JwtPayload } from 'jsonwebtoken';
import { ROLE } from '../constants/role.constant.js';

export type AdminRole = (typeof ROLE)[keyof typeof ROLE];

export type AccessTokenPayload = JwtPayload & {
    sub: string;
    role: AdminRole;
    tokenType: 'access';
};

export type PasswordResetTokenPayload = JwtPayload & {
    sub: string;
    tokenType: 'password_reset';
};
