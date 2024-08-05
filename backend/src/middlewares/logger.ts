import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const requestTransport = new winston.transports.DailyRotateFile({
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 14,
});

const errorLogTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 14,
});

export const requestLogger = expressWinston.logger({
  transports: [requestTransport],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [errorLogTransport],
  format: winston.format.json(),
});
