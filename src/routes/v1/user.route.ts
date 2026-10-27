import { Router } from 'express';

import { createUserController } from '../../controllers/user.controller.js';
import {
    requireAccessToken,
    requireAdminRole,
} from '../../middlewares/auth.middleware.js';
import { createUserSchema } from '../../validators/user.validator.js';
import { validateRequestBody } from '../../validators/index.js';

const userRouter = Router();

userRouter.post(
    '/',
    requireAccessToken,
    requireAdminRole,
    validateRequestBody(createUserSchema),
    createUserController,
);

export default userRouter;