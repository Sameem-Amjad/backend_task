import { INVALID } from "zod";

const responseMessages = {
    success: {
        REGISTER: 'Registration successful. Please check your email to verify your account.',
        LOGIN: 'User logged in successfully.',
        registeredWithRole: (role: string) => `User registered with role ${role}`,
        EMAIL_VERIFIED: 'Email verified successfully. You can now login.',
        OTP_RESENT: 'OTP resent to user',
        TOKEN_REFRESHED: 'Token refreshed successfully',


    },
    fail: {
        REGISTER: 'Failed to register user.',
        LOGIN: 'Failed to login user.',
        USER_ALREADY_EXISTS: 'User already exists.',
        INVALID_CREDENTIALS: 'Invalid credentials.',
        EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in',
        INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token.',
        NO_OTP_REQUEST_FOUND: 'No OTP request found',
        OTP_EXPIRED: 'OTP has expired',
        INVALID_OR_MISSING_EMAIL_OTP: 'Invalid or missing email or OTP',
        USER_ALREADY_VERIFIED: 'User is already verified',
        REFRESH_TOKEN_INVALID: 'Invalid refresh token',
        TOKEN_REFRESH: 'Failed to refresh token. Please login again.',
        REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
        REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found or revoked',
        REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
        USER_NOT_FOUND: 'User not found',
    },
};

export default responseMessages;