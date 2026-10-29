import { Router } from 'express';

import { createUserController } from '../../controllers/user.controller.js';
import { authenticateUser } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorization.middleware.js';
import { createUserSchema } from '../../validators/user.validator.js';
import { validateRequestBody } from '../../validators/index.js';
import { ROLE } from '../../constants/role.constant.js';

const userRouter = Router();

userRouter.post(
    '/',
    authenticateUser,
    authorizeRole(ROLE.ADMIN),
    validateRequestBody(createUserSchema),
    createUserController,
);

export default userRouter;