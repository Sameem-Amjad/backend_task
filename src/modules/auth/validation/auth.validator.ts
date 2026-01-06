import { z } from 'zod';
import { Role } from '../../../constants/enums.js';
import { passwordValidator } from '../../../utils/validators/password.validator.js';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: passwordValidator,
        role: z.nativeEnum(Role).refine((val) => Object.values(Role).includes(val), {
            message: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}`,
        }).optional(),
    }),
});

export const verifyEmailSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: passwordValidator,
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        token: z.string().min(1, { message: "Refresh token is required" }),
    }),
});