import prisma from '../config/prisma/prisma.js';
import { Prisma, Article } from '@prisma/client';

export const createArticle = async (data: Prisma.ArticleCreateInput): Promise<Article> => {
    return await prisma.article.create({ data });
};

export const findArticleById = async (id: string): Promise<Article | null> => {
    return await prisma.article.findUnique({ where: { id } });
};

export const findAllArticles = async (
    page: number = 1,
    limit: number = 10
): Promise<{ articles: Article[]; total: number }> => {
    const skip = (page - 1) * limit;
    const [articles, total] = await prisma.$transaction([
        prisma.article.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { id: true, email: true, role: true } } }
        }),
        prisma.article.count(),
    ]);
    return { articles, total };
};

export const updateArticle = async (id: string, data: Prisma.ArticleUpdateInput): Promise<Article> => {
    return await prisma.article.update({ where: { id }, data });
};

export const deleteArticle = async (id: string): Promise<Article> => {
    return await prisma.article.delete({ where: { id } });
};

export const alreadyTitleExists = async (title: string): Promise<boolean> => {
    const article = await prisma.article.findFirst({ where: { title } });
    return !!article;
}