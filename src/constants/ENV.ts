import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

export const ENV = Object.freeze(z.object({
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRY: z.string(),
    JWT_REFRESH_EXPIRY: z.string(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SMTP_HOST: z.string().optional().nullable(),
    SMTP_PORT: z.string().optional().nullable(),
    SMTP_USER: z.string().optional().nullable(),
    SMTP_PASS: z.string().optional().nullable(),
}).parse(process.env));