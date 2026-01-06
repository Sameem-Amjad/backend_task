import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../../../repository/userRepository.js';
import { ENV } from '../../../constants/ENV.js';
import { Role } from '../../../constants/enums.js';
import prisma from '../../../config/prisma/prisma.js';
import responseMessages from '../responses/auth.responses.js';
import status from 'http-status';
import bcrypt from 'bcryptjs';

import { comparePassword, hashPassword } from '../../../utils/common/password.js';
import { sendVerificationEmail } from '../../../services/mail/mail.service.js';

export const register = async (input: any) => {
    const existing = await findUserByEmail(input.email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existing && !existing.isVerified) {
        await prisma.user.update({
            where: { id: existing.id },
            data: {
                otpCode: hashedOtp,
                otpExpiresAt,
            },
        });

        await prisma.auditLog.create({
            data: {
                action: 'RESEND_OTP',
                userId: existing.id,
                details: responseMessages.success.OTP_RESENT,
            },
        });

        await sendVerificationEmail(existing.email, otp);

        return {
            id: existing.id,
            email: existing.email,
            role: existing.role,
            message: responseMessages.success.OTP_RESENT,
        };
    }

    if (existing && existing.isVerified) {
        throw { message: responseMessages.fail.USER_ALREADY_EXISTS, statusCode: status.CONFLICT };
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await createUser({
        email: input.email,
        password: hashedPassword,
        role: input.role || Role.VIEWER,
        isVerified: false,
        otpCode: hashedOtp,
        otpExpiresAt,
    });

    await prisma.auditLog.create({
        data: {
            action: 'REGISTER',
            userId: user.id,
            details: responseMessages.success.registeredWithRole(user.role),
        },
    });

    await sendVerificationEmail(user.email, otp);

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};

export const login = async (input: { email: string; password: string }) => {
    const user = await findUserByEmail(input.email);
    if (!user) throw { message: responseMessages.fail.INVALID_CREDENTIALS, statusCode: status.UNAUTHORIZED };

    if (!user.isVerified) {
        throw { message: responseMessages.fail.EMAIL_NOT_VERIFIED, statusCode: status.FORBIDDEN };
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) throw { message: responseMessages.fail.INVALID_CREDENTIALS, statusCode: status.UNAUTHORIZED };
    //@ts-ignore
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_ACCESS_EXPIRY }
    );

    //@ts-ignore
    const refreshToken = jwt.sign({ id: user.id }, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRY });

    await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
};

export const verifyEmail = async (email: string, otp: string) => {
    const user = await findUserByEmail(email);

    if (user && user.isVerified) {
        throw { message: responseMessages.fail.USER_ALREADY_VERIFIED, statusCode: status.BAD_REQUEST };
    }

    if (!user) throw { message: responseMessages.fail.INVALID_VERIFICATION_TOKEN, statusCode: status.BAD_REQUEST };

    if (!user.otpCode || !user.otpExpiresAt) {
        throw { message: responseMessages.fail.NO_OTP_REQUEST_FOUND, statusCode: status.BAD_REQUEST };
    }

    if (new Date() > user.otpExpiresAt) {
        throw { message: responseMessages.fail.OTP_EXPIRED, statusCode: status.BAD_REQUEST };
    }

    const isValid = await bcrypt.compare(otp, user.otpCode);
    if (!isValid) throw { message: responseMessages.fail.INVALID_VERIFICATION_TOKEN, statusCode: status.BAD_REQUEST };

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            otpCode: null,
            otpExpiresAt: null
        }
    });

    await prisma.auditLog.create({
        data: { action: 'VERIFY_OTP', userId: user.id, details: responseMessages.success.EMAIL_VERIFIED }
    });

    return { message: responseMessages.success.EMAIL_VERIFIED };
};

export const refreshToken = async (token: string) => {
    if (!token) throw { message: responseMessages.fail.REFRESH_TOKEN_REQUIRED, statusCode: status.BAD_REQUEST };

    let decoded: any;
    try {
        decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
    } catch (error) {
        throw { message: responseMessages.fail.REFRESH_TOKEN_INVALID, statusCode: status.UNAUTHORIZED };
    }

    const savedToken = await prisma.refreshToken.findUnique({
        where: { token },
    });

    if (!savedToken) throw { message: responseMessages.fail.REFRESH_TOKEN_NOT_FOUND, statusCode: status.UNAUTHORIZED };

    if (savedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: savedToken.id } });
        throw { message: responseMessages.fail.REFRESH_TOKEN_EXPIRED, statusCode: status.UNAUTHORIZED };
    }

    const user = await findUserById(savedToken.userId);
    if (!user) throw { message: responseMessages.fail.USER_NOT_FOUND, statusCode: status.NOT_FOUND };

    //@ts-ignore
    const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_ACCESS_EXPIRY }
    );

    return { accessToken: newAccessToken };
};