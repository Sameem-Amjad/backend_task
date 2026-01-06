import { Router } from 'express';
import * as AuthController from '../controller/auth.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middleware.js';
import { registerSchema, loginSchema, verifyEmailSchema, refreshTokenSchema } from '../validation/auth.validator.js';
import { Paths } from '../../../constants/Paths.js';

const authRouter = Router();

authRouter.post(Paths.Auth.Register, validateSchema(registerSchema), AuthController.register);
authRouter.post(Paths.Auth.Verify, validateSchema(verifyEmailSchema), AuthController.verifyEmail);
authRouter.post(Paths.Auth.Login, validateSchema(loginSchema), AuthController.login);
authRouter.post(Paths.Auth.Refresh, validateSchema(refreshTokenSchema), AuthController.refresh);

export default authRouter;