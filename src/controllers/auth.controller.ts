import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type {
    LoginUserDto,
    ResetPasswordDto,
} from '../dtos/auth.dto.js';
import UserRepository from '../repository/user.repository.js';
import AuthService from '../services/auth.service.js';
import type { AuthRequest } from '../types/AuthRequest.js';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

// Handle sign-in requests and store the appropriate token in an HttpOnly cookie.
async function loginHandler(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const requestBody = req.body as LoginUserDto;
        const response = await authService.loginService(requestBody);

        res.cookie('auth_token', response.token, {
            ...authCookieOptions,
            maxAge: response.requiresPasswordReset
                ? 10 * 60 * 1000
                : 60 * 60 * 1000,
        });

        const { token, ...responseData } = response;

        res.status(StatusCodes.OK).json({
            success: true,
            message: response.requiresPasswordReset
                ? 'Password reset required.'
                : 'Login successful.',
            data: responseData,
            error: {},
        });
    } catch (error) {
        next(error);
    }
}

// Reset the password using the identity from the verified reset token.
async function resetPasswordHandler(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        if (
            !req.auth ||
            req.auth.tokenType !== 'password_reset'
        ) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'A valid password-reset token is required.',
            });
            return;
        }

        const requestBody = req.body as ResetPasswordDto;

        const response = await authService.resetPasswordService(
            req.auth.sub,
            requestBody.newPassword,
        );

        res.clearCookie('auth_token', authCookieOptions);

        res.status(StatusCodes.OK).json({
            success: true,
            message: response.message,
            data: response,
            error: {},
        });
    } catch (error) {
        next(error);
    }
}

export default {
    loginHandler,
    resetPasswordHandler,
};