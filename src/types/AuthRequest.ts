import type { Request } from 'express';

import type {
    AccessTokenPayload,
    PasswordResetTokenPayload,
} from './UserTokenPayload.js';

export type AuthRequest = Request & {
    auth?: AccessTokenPayload | PasswordResetTokenPayload;
};