import { Joi } from 'celebrate';
import isURL from 'validator/lib/isURL';
import BadRequestError from '../errors/bad-request-error';

export const customUrlValidation = (url: string) => {
  if (!isURL(url)) {
    throw new BadRequestError('Url не валидный');
  }
  return url;
};

export const createUserSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(customUrlValidation).message('Url не валидный'),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
};

export const getUserByIdSchema = {
  params: {
    userId: Joi.string().required().hex().length(24),
  },
};

export const updateUserSchema = {
  body: {
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  },
};

export const updateAvatarSchema = {
  body: {
    avatar: Joi.string().required().custom(customUrlValidation).message('Url не валидный'),
  },
};
