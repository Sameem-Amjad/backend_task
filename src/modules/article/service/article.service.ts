import * as ArticleRepo from '../../../repository/articleRepository.js';
import { Role } from '../../../constants/enums.js';
import responseMessages from '../responses/article.response.js';
import status from 'http-status';

export const create = async (userId: string, data: any) => {
    let alreadyExists = await ArticleRepo.alreadyTitleExists(data.title);
    if (alreadyExists) {
        throw {};
    }

    const article = await ArticleRepo.createArticle({
        ...data,
        author: { connect: { id: userId } }
    });
    return article;
};

export const getAll = async (page: number, limit: number) => {
    return await ArticleRepo.findAllArticles(page, limit);
};

export const update = async (userId: string, userRole: Role, articleId: string, data: any) => {
    const article = await ArticleRepo.findArticleById(articleId);
    if (!article) throw { message: responseMessages.fail.ARTICLE_NOT_FOUND, statusCode: status.NOT_FOUND };

    if (userRole !== Role.ADMIN && article.authorId !== userId) {
        throw { message: responseMessages.fail.PERMISSION_DENIED, statusCode: status.FORBIDDEN };
    }

    return await ArticleRepo.updateArticle(articleId, data);
};

export const remove = async (articleId: string) => {
    const article = await ArticleRepo.findArticleById(articleId);
    if (!article) throw { message: responseMessages.fail.ARTICLE_NOT_FOUND, statusCode: status.NOT_FOUND };

    return await ArticleRepo.deleteArticle(articleId);
};