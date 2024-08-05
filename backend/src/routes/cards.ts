import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { createCardSchema, deleteOrLikeCardSchema } from '../validators/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(createCardSchema), createCard);
cardsRouter.delete('/:cardId', celebrate(deleteOrLikeCardSchema), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(deleteOrLikeCardSchema), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate(deleteOrLikeCardSchema), dislikeCard);

export default cardsRouter;
