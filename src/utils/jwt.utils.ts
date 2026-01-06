import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import status from "http-status";
import { ENV } from "../../src/constants/ENV.js";
import { commonResponses } from "./common/commonResponses.js";

/*
 * Generate a JWT token for a user.
 */
export const generateJwtToken = (userId: string, role: string = "user"): string => {
    const payload = { userId, role };
    const secret = ENV.JWT_SECRET as Secret; // ✅ Ensure correct type
    const expiresInValue: number | string = typeof ENV.JWT_ACCESS_EXPIRY === "number"
        ? (ENV.JWT_ACCESS_EXPIRY as number)
        : (ENV.JWT_ACCESS_EXPIRY as unknown as string);
    const options: SignOptions = {
        // @ts-ignore: TypeScript may need help inferring the type here
        expiresIn: expiresInValue,
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

/*
 * Verify a JWT token.
 */
export const verifyJwtToken = (token: string): JwtPayload | string => {
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET as Secret);
        return decoded;
    } catch (error) {
        const err = new Error(commonResponses.fail.INVALID_TOKEN);
        (err as any).status = status.UNAUTHORIZED;
        throw err;
    }
};

/*
 * Decode a JWT token without verifying.
 */
export const decodeJwtToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token, { complete: true });
        return decoded as JwtPayload | null;
    } catch (error) {
        const err = new Error(commonResponses.fail.INVALID_TOKEN);
        (err as any).status = status.UNAUTHORIZED;
        throw err;
    }
};

/*
 * Verify token and handle expiration gracefully.
 */
export const verifyJwtTokenGracefully = (
    token: string
): { decoded: JwtPayload | string; isExpired: boolean } => {
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET as Secret) as JwtPayload;
        return { decoded, isExpired: false };
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            const decoded = jwt.decode(token);
            if (!decoded) {
                const err = new Error(commonResponses.fail.INVALID_TOKEN);
                (err as any).status = status.UNAUTHORIZED;
                throw err;
            }
            return { decoded, isExpired: true };
        } else {
            const err = new Error(commonResponses.fail.INVALID_TOKEN);
            (err as any).status = status.UNAUTHORIZED;
            throw err;
        }
    }
};

export default {
    generateJwtToken,
    verifyJwtToken,
    decodeJwtToken,
    verifyJwtTokenGracefully,
};
