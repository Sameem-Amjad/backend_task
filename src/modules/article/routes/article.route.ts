import { Router } from 'express';
import * as ArticleController from '../controller/article.controller.js';
import { authenticate, authorize } from '../../../middlewares/authenticate.middleware.js';
import { validateSchema } from '../../../middlewares/validateSchema.middleware.js';
import { createArticleSchema, updateArticleSchema } from '../validation/article.validation.js';
import { Role } from '../../../constants/enums.js';
import { Paths } from '../../../constants/Paths.js';
import z from 'zod';

const articleRouter = Router();

// Public: List articles
articleRouter.get(
    Paths.Articles.Get,
    validateSchema(z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    })),
    ArticleController.getAll
);

// Protected: Create (Admin, Editor)
articleRouter.post(
    Paths.Articles.Create,
    authenticate,
    authorize([Role.ADMIN, Role.EDITOR]),
    validateSchema(createArticleSchema),
    ArticleController.create
);

// Protected: Update (Admin, Editor - ownership check in service)
articleRouter.put(
    Paths.Articles.Update,
    authenticate,
    authorize([Role.ADMIN, Role.EDITOR]),
    validateSchema(updateArticleSchema),
    ArticleController.update
);

// Protected: Delete (Admin only)
articleRouter.delete(
    Paths.Articles.Delete,
    authenticate,
    authorize([Role.ADMIN]),
    ArticleController.remove
);

export default articleRouter;