import { randomBytes } from 'node:crypto';
import type { CreateUserDto } from '../dtos/user.dto.js';
import UserRepository from '../repository/user.repository.js';
import { hashPassword } from '../utils/auth/auth.js';
import {
    ConflictError,
    NotfoundError,
} from '../utils/errors/app.error.js';

class UserService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // Create a user with a temporary password for initial sign-in testing.
    async createUserService(data: CreateUserDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictError('A user with this email already exists.');
        }

        const role = await this.userRepository.findRoleByName(data.role);

        if (!role) {
            throw new NotfoundError(`Role ${data.role} not found.`);
        }

        const temporaryPassword = randomBytes(24).toString('base64url');
        const passwordHash = await hashPassword(temporaryPassword);

        const user = await this.userRepository.createUser({
            name: data.name,
            email: data.email,
            phoneNo: data.phoneNo,
            passwordHash,
            roleId: role.id,
        });

        return {
            user: {
                publicId: user.publicId,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                role: user.role.name,
                isActive: user.isActive,
                passwordResetRequired: user.passwordResetRequired,
            },
            temporaryPassword,
        };
    }
}

export default UserService;