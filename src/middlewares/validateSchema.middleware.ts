import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import status from 'http-status';
import ResponseHandler from '../utils/common/responseHandler.js';
import { commonResponses } from '../utils/common/commonResponses.js';

export const validateSchema = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return ResponseHandler.fail(
                    res,
                    commonResponses.fail.OPERATION_FAILED,
                    { errors: error.errors },
                    status.BAD_REQUEST
                );
            }
            return ResponseHandler.fail(
                res,
                commonResponses.fail.OPERATION_FAILED,
                { message: 'Invalid request' },
                status.BAD_REQUEST
            );
        }
    };