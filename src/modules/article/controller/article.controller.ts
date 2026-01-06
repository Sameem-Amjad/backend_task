import { Request, Response } from 'express';
import * as ArticleService from '../service/article.service.js';
import status from 'http-status';
import ResponseHandler from '../../../utils/common/responseHandler.js';
import { commonResponses } from '../../../utils/common/commonResponses.js';
import responseMessages from '../responses/article.response.js';

export const create = async (req: Request & { user?: { id: string } }, res: Response) => {
    try {
        let userId = req.user!.id;
        let { title, content, state } = req.body;

        const result = await ArticleService.create(userId, { title, content, state });
        return ResponseHandler.success(
            res,
            result,
            status.CREATED || status.OK,
            responseMessages.success.ARTICLE_CREATED || commonResponses.success.OPERATION_SUCCESSFUL
        );
    } catch (error: { message: string; statusCode?: number } | any) {
        return ResponseHandler.fail(
            res,
            responseMessages.fail.ARTICLE_CREATION_FAILED,
            { message: error.message },
            error.statusCode || status.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await ArticleService.getAll(page, limit);
        return ResponseHandler.success(
            res,
            result,
            status.OK,
            responseMessages.success.ARTICLES_FETCHED || commonResponses.success.OPERATION_SUCCESSFUL
        );
    } catch (error: { message: string; statusCode?: number } | any) {
        return ResponseHandler.fail(
            res,
            responseMessages.fail.ARTICLES_FETCH_FAILED || commonResponses.fail.OPERATION_FAILED,
            { message: error.message },
            error.statusCode || status.INTERNAL_SERVER_ERROR
        );
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const result = await ArticleService.update(req.user!.id, req.user!.role, req.params.id, req.body);
        return ResponseHandler.success(
            res,
            result,
            status.OK,
            responseMessages.success.ARTICLE_UPDATED || commonResponses.success.OPERATION_SUCCESSFUL
        );
    } catch (error: { message: string; statusCode?: number } | any) {
        if (error.message === responseMessages.fail.PERMISSION_DENIED) return ResponseHandler.fail(
            res,
            error.message || commonResponses.fail.OPERATION_FAILED,
            {},
            error.statusCode || status.FORBIDDEN
        );
        if (error.message === responseMessages.fail.ARTICLE_NOT_FOUND) return ResponseHandler.fail(
            res,
            error.message || commonResponses.fail.OPERATION_FAILED,
            {},
            error.statusCode || status.NOT_FOUND
        );
        return ResponseHandler.fail(
            res,
            responseMessages.fail.ARTICLE_UPDATE_FAILED || commonResponses.fail.OPERATION_FAILED,
            { message: error.message },
            error.statusCode || status.INTERNAL_SERVER_ERROR
        );
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await ArticleService.remove(req.params.id);
        return ResponseHandler.success(
            res,
            {},
            status.OK,
            responseMessages.success.ARTICLE_DELETED || commonResponses.success.OPERATION_SUCCESSFUL
        );
    } catch (error: { message: string; statusCode?: number } | any) {
        if (error.message === responseMessages.fail.ARTICLE_NOT_FOUND) return ResponseHandler.fail(
            res,
            error.message || commonResponses.fail.OPERATION_FAILED,
            {},
            error.statusCode || status.NOT_FOUND
        );
        return ResponseHandler.fail(
            res,
            responseMessages.fail.ARTICLE_DELETION_FAILED || commonResponses.fail.OPERATION_FAILED,
            { message: error.message || commonResponses.fail.OPERATION_FAILED },
            error.statusCode || status.INTERNAL_SERVER_ERROR
        );
    }
};