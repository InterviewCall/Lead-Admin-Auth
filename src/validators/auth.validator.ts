
import { z } from 'zod';

// Validate credentials submitted during sign-in.
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: 'Invalid email address' }),

    // Temporary passwords may be randomly generated, so only require a non-empty value.
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .max(128, { message: 'Password is too long' }),
});

// Validate the new password and its confirmation.
export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .max(32, { message: 'Password must not exceed 32 characters' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]+$/,
                {
                    message:
                        'Password must contain an uppercase letter, a lowercase letter, a number, and a supported special character',
                }
            ),

        confirmPassword: z
            .string()
            .min(1, { message: 'Please confirm your new password' }),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            path: ['confirmPassword'],
            message: 'Passwords do not match',
        }
    );

export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
