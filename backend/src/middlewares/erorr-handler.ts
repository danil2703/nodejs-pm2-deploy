import { ErrorRequestHandler } from 'express';
import { constants } from 'http2';

// this middleware not work without next param
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка сервера.' : err.message;
  res.status(statusCode).send({ message });
};

export default errorHandler;
