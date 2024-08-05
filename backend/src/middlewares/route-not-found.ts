import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
};

export default routeNotFound;
