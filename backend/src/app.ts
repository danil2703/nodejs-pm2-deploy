import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import errorHandler from './middlewares/erorr-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import { MONGO_URL, PORT } from './environments';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

mongoose.connect(MONGO_URL);

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
