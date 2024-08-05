import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import ForbiddenError from '../errors/forbidden-error';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

const { ValidationError, CastError } = mongoose.Error;

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({ })
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: res.locals.user._id })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const currentUserId = res.locals.user._id;

  return Card.findById(cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then(async (card) => {
      if (currentUserId !== card.owner) {
        return next(new ForbiddenError('Вы не можете удалить эту карточку.'));
      }
      return Card.findByIdAndDelete(cardId).then(() => res.send(card));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id карточки.'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = res.locals.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id карточки.'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = res.locals.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id карточки.'));
      } else {
        next(err);
      }
    });
};
