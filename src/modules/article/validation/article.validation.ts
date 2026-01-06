import { z } from 'zod';
import { ArticleState } from '../../../constants/enums.js';

export const createArticleSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        content: z.string().min(10),
        state: z.nativeEnum(ArticleState).optional(),
    }),
});

export const updateArticleSchema = z.object({
    body: z.object({
        title: z.string().min(3).optional(),
        content: z.string().min(10).optional(),
        state: z.nativeEnum(ArticleState).optional(),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});