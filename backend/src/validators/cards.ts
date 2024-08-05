import { Joi } from 'celebrate';
import { customUrlValidation } from './users';

export const createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(customUrlValidation).message('Url не валидный'),
  }),
};

export const deleteOrLikeCardSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};
