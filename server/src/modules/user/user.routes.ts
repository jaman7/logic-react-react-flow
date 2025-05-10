import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import express from 'express';
import {
  changePasswordHandler,
  createUserHandler,
  deleteUserHandler,
  getMeHandler,
  getUserHandler,
  getUsersHandler,
  updateMeHandler,
  updateUserHandler,
} from './user.controller';
import { validate } from '@/middleware/validate';
import { createUserSchema, updatePasswordSchema, updateUserSchema } from './user.schema';

const userRouter = express.Router();

// Middleware dla zalogowanych użytkowników
userRouter.use(deserializeUser, requireUser);

// Dla zalogowanego użytkownika
userRouter.patch('/me/password', validate(updatePasswordSchema), changePasswordHandler);
userRouter.get('/me', getMeHandler);
userRouter.put('/me', validate(updateUserSchema), updateMeHandler);

// Lista użytkowników (dla ADMIN)
userRouter.get('/', getUsersHandler);
userRouter.get('/:id', getUserHandler);
userRouter.post('/', validate(createUserSchema), createUserHandler);
userRouter.put('/:id', validate(updateUserSchema), updateUserHandler);
userRouter.delete('/:id', deleteUserHandler);

export default userRouter;
