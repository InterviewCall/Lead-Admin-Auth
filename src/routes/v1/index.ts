import { Router } from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/users', userRouter);

export default v1Router;