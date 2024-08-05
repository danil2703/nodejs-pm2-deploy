import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createUserSchema, loginSchema } from '../validators/users';
import { createUser, login } from '../controllers/users';
import authMiddleware from '../middlewares/auth';
import cardsRouter from './cards';
import usersRouter from './users';
import routeNotFound from '../middlewares/route-not-found';

const router = Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate(loginSchema), login);
router.post('/signup', celebrate(createUserSchema), createUser);

router.use(authMiddleware);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use('*', routeNotFound);

export default router;
