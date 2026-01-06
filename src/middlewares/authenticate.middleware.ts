import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../constants/ENV.js';
import { commonResponses } from '../utils/common/commonResponses.js';
import ResponseHandler from '../utils/common/responseHandler.js';
import status from 'http-status';
import { Role } from '../constants/enums.js';


// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return ResponseHandler.fail(
            res,
            commonResponses.fail.AUTHORIZATION_HEADER_MISSING_OR_INVALID,
            {},
            status.UNAUTHORIZED
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: Role };
        req.user = decoded;
        next();
    } catch (err) {
        return ResponseHandler.fail(
            res,
            commonResponses.fail.INVALID_TOKEN,
            { err },
            status.UNAUTHORIZED
        );
    }
};

export const authorize = (allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return ResponseHandler.fail(
                res,
                commonResponses.fail.USER_NOT_AUTHENTICATED,
                {},
                status.UNAUTHORIZED
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return ResponseHandler.fail(
                res,
                commonResponses.fail.INSUFFICIENT_PERMISSIONS,
                {},
                status.FORBIDDEN
            );
        }

        next();
    };
};