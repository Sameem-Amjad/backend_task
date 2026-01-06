import { Request, Response } from 'express';
import * as AuthService from '../service/auth.service.js';
import status from 'http-status';
import ResponseHandler from '../../../utils/common/responseHandler.js';
import responseMessages from '../responses/auth.responses.js';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.register(req.body);
        return ResponseHandler.success(
            res,
            result,
            status.CREATED,
            responseMessages.success.REGISTER
        );
    } catch (error: { message?: string, statusCode?: number, details?: any } | any) {
        return ResponseHandler.fail(
            res,
            error.message || responseMessages.fail.REGISTER,
            { error: error.details },
            error.statusCode || status.INTERNAL_SERVER_ERROR,

        );
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body as { email: string; password: string };
        const result = await AuthService.login({ email, password });
        return ResponseHandler.success(
            res,
            result,
            status.OK,
            responseMessages.success.LOGIN
        );
    } catch (error: { message?: string, statusCode?: number, details?: any } | any) {
        return ResponseHandler.fail(
            res,
            error.message || responseMessages.fail.LOGIN,
            { error: error.details },
            error.statusCode || status.UNAUTHORIZED,
        );
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body as { email: string; otp: string };
        if (!email || !otp) {
            throw { message: responseMessages.fail.INVALID_OR_MISSING_EMAIL_OTP, statusCode: status.BAD_REQUEST };
        }
        const result = await AuthService.verifyEmail(email as string, otp as string);
        return ResponseHandler.success(
            res,
            {},
            status.OK,
            responseMessages.success.EMAIL_VERIFIED
        );
    } catch (error: { message?: string, statusCode?: number, details?: any } | any) {
        return ResponseHandler.fail(
            res,
            error.message || responseMessages.fail.INVALID_OR_MISSING_EMAIL_OTP,
            { error: error.details },
            error.statusCode || status.BAD_REQUEST,
        );
    }
};


export const refresh = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const result = await AuthService.refreshToken(token);
        return ResponseHandler.success(
            res,
            result,
            status.OK,
            responseMessages.success.TOKEN_REFRESHED
        );
    } catch (error: { message?: string, statusCode?: number, details?: any } | any) {
        return ResponseHandler.fail(
            res,
            error.message || responseMessages.fail.TOKEN_REFRESH,
            { error: error.details },
            error.statusCode || status.UNAUTHORIZED,
        );
    }
};

