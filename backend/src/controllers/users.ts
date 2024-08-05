import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import { JWT_SECRET } from '../environments';

const { ValidationError, CastError } = mongoose.Error;

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id пользователя.'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      }).then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
        .catch((err) => {
          const coflictMongooseErrorCode = 11000;
          if (err instanceof ValidationError) {
            return next(new BadRequestError(err.message));
          }
          if (err.code === coflictMongooseErrorCode) {
            return next(new ConflictError('Данный email адрес уже зарегистрирован.'));
          }
          return next(err);
        });
    });
};

export const updateUserData = (
  req: Request,
  res: Response,
  next: NextFunction,
  updateData: Record<string, string>,
) => {
  const userId = res.locals.user._id;

  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  updateUserData(req, res, next, { name, about });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  updateUserData(req, res, next, { avatar });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = res.locals.user._id;

  return User.findById(currentUserId)
    .then((user) => res.send(user))
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const sevenDay = 3600000 * 24 * 7;

  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: sevenDay, httpOnly: true }).end();
  })
    .catch(next);
};
