import prisma from '../db/prisma.js';

class UserRepository {
    // Find a user by email and retrieve the role required for authentication.
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                publicId: true,
                name: true,
                email: true,
                passwordHash: true,
                isActive: true,
                passwordResetRequired: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    // Find the current account state and role using the public UUID.
    async findByPublicId(publicId: string) {
        return prisma.user.findUnique({
            where: {
                publicId,
            },
            select: {
                publicId: true,
                isActive: true,
                passwordResetRequired: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    // Update the last successful login timestamp.
    async updateLastLogin(publicId: string) {
        return prisma.user.update({
            where: {
                publicId,
            },
            data: {
                lastLoginAt: new Date(),
            },
            select: {
                publicId: true,
                lastLoginAt: true,
            },
        });
    }

    // Change the password and activate the account only when a reset is required.
    async resetPasswordAndActivate(
        publicId: string,
        passwordHash: string,
    ) {
        return prisma.user.updateMany({
            where: {
                publicId,
                passwordResetRequired: true,
            },
            data: {
                passwordHash,
                passwordResetRequired: false,
                isActive: true,
            },
        });
    }

    // Find the selected role before creating a user.
    async findRoleByName(name: 'ADMIN' | 'MANAGER') {
        return prisma.role.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    // Create a new user with an inactive account and a pending password reset.
    async createUser(data: {
        name: string;
        email: string;
        phoneNo: string;
        passwordHash: string;
        roleId: number;
    }) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNo: data.phoneNo,
                passwordHash: data.passwordHash,
                roleId: data.roleId,
                isActive: false,
                passwordResetRequired: true,
            },
            select: {
                publicId: true,
                name: true,
                email: true,
                phoneNo: true,
                isActive: true,
                passwordResetRequired: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
}

export default UserRepository;