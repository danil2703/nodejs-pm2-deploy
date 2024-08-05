import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getCurrentUser, getUserById, getUsers, updateAvatar, updateUser,
} from '../controllers/users';
import { getUserByIdSchema, updateAvatarSchema, updateUserSchema } from '../validators/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', celebrate(getUserByIdSchema), getUserById);
usersRouter.patch('/me', celebrate(updateUserSchema), updateUser);
usersRouter.patch('/me/avatar', celebrate(updateAvatarSchema), updateAvatar);

export default usersRouter;
