import express from 'express';
import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import { validate } from '@/middleware/validate';
import { loginUserHandler, logoutUserHandler, refreshAccessTokenHandler, registerUserHandler } from './auth.controller';
import { loginUserSchema } from './auth.schema';
import { createUserSchema } from '../user/user.schema';

const authRouter = express.Router();
authRouter.post('/signup', validate(createUserSchema), registerUserHandler);
authRouter.post('/login', validate(loginUserSchema), loginUserHandler);
authRouter.get('/logout', deserializeUser, requireUser, logoutUserHandler);
authRouter.post('/refresh', refreshAccessTokenHandler);

export default authRouter;
