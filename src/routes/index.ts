import { Router } from 'express';
import authRouter from '../modules/auth/routes/auth.routes.js';
import articleRouter from '../modules/article/routes/article.route.js';
import { Paths } from '../constants/Paths.js';

const router = Router();
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});
router.use(Paths.Auth.Base, authRouter);
router.use(Paths.Articles.Base, articleRouter);

export default router;