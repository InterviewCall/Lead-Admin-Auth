
import { Router } from 'express';

import authController from '../../controllers/auth.controller.js';
import {
    requirePasswordResetToken,
} from '../../middlewares/auth.middleware.js';
import {
    loginSchema,
    resetPasswordSchema,
} from '../../validators/auth.validator.js';
import { validateRequestBody } from '../../validators/index.js';

const authRouter = Router();

authRouter.post(
    '/login',
    validateRequestBody(loginSchema),
    authController.loginHandler
);

authRouter.post(
    '/reset-password',
    requirePasswordResetToken,
    validateRequestBody(resetPasswordSchema),
    authController.resetPasswordHandler
);

export default authRouter;
