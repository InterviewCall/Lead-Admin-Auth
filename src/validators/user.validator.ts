
import { z } from 'zod';

// Validate the details required to create an ADMIN or MANAGER account.
export const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(100, { message: 'Name must not exceed 100 characters' }),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: 'Invalid email address' }),

    phoneNo: z
        .string()
        .trim()
        .regex(/^\+?[1-9]\d{7,14}$/, {
            message: 'Enter a valid phone number with country code if required',
        }),

    role: z.enum(['ADMIN', 'MANAGER'], {
        message: 'Role must be ADMIN or MANAGER',
    }),
});
