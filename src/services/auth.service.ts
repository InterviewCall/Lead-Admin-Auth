import UserRepository from '../repository/user.repository.js';
import {
    checkPassword,
    hashPassword,
    createAccessToken,
    createPasswordResetToken,
} from '../utils/auth/auth.js';
import { UnauthorizedError } from '../utils/errors/app.error.js';
import { ROLE } from '../constants/role.constant.js';

class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // Authenticate the user and issue only the token permitted by the account state.
    async loginService(data: {
        email: string;
        password: string;
    }) {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new UnauthorizedError('Invalid email or password.');
        }

        const passwordMatches = await checkPassword(
            data.password,
            user.passwordHash
        );

        if (!passwordMatches) {
            throw new UnauthorizedError('Invalid email or password.');
        }

        const role = user.role.name;

        if (role !== ROLE.ADMIN  && role !== ROLE.MANAGER ) {
            throw new UnauthorizedError(
                'This account is not permitted to access the admin panel.'
            );
        }

        // A valid temporary password may only start the password-reset flow.
        if (user.passwordResetRequired) {
            await this.userRepository.updateLastLogin(user.publicId);

            return {
                requiresPasswordReset: true,
                tokenType: 'password_reset' as const,
                token: createPasswordResetToken(user.publicId),
            };
        }

        // An inactive account without a pending password reset cannot sign in.
        if (!user.isActive) {
            throw new UnauthorizedError(
                'This account is inactive. Please contact an administrator.'
            );
        }

        await this.userRepository.updateLastLogin(user.publicId);

        return {
            requiresPasswordReset: false,
            tokenType: 'access' as const,
            token: createAccessToken(user.publicId, role),
            user: {
                publicId: user.publicId,
                name: user.name,
                email: user.email,
                role,
            },
        };
    }

    // Reset the password using the public ID from a verified password-reset token.
    async resetPasswordService(
        publicId: string,
        newPassword: string
    ) {
        const user = await this.userRepository.findByPublicId(publicId);

        if (
            !user ||
            !user.passwordResetRequired ||
            user.isActive
        ) {
            throw new UnauthorizedError(
                'Password reset is not required or is no longer allowed.'
            );
        }

        const passwordHash = await hashPassword(newPassword);

        const result = await this.userRepository.resetPasswordAndActivate(
            publicId,
            passwordHash
        );

        if (result.count !== 1) {
            throw new UnauthorizedError(
                'Password reset could not be completed. Please sign in again.'
            );
        }

        return {
            passwordReset: true,
            isActive: true,
            message: 'Password reset successfully. Please sign in again.',
        };
    }
}

export default AuthService;
