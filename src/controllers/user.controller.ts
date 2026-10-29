import type { Request, Response, NextFunction } from 'express';
import type { CreateUserDto } from '../dtos/user.dto.js';
import UserRepository from '../repository/user.repository.js';
import UserService from '../services/user.service.js';
import { sendSuccess } from '../utils/helpers/response.helper.js';

const userService = new UserService(new UserRepository());

// Create an ADMIN or MANAGER account and return its temporary password for testing.
export async function createUserController(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await userService.createUserService(
            req.body as CreateUserDto,
        );

        sendSuccess(
            res,
            {
                user: result.user,
                invitation: result.invitation,
            },
            201,
            result.invitation.queued
                ? 'User created successfully.'
                : 'User created, but invitation could not be queued. Please retry.',
        );
    } catch (error) {
        next(error);
    }
}