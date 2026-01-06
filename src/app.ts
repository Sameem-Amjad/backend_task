import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { ENV } from './constants/ENV.js';
import ResponseHandler from './utils/common/responseHandler.js';
import { commonResponses } from './utils/common/commonResponses.js';
import status from 'http-status';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    ResponseHandler.success(
        res, {}, status.OK,
        ENV.NODE_ENV === 'production' ? commonResponses.success.SERVICE_UP : commonResponses.success.SERVICE_UP_WITH_ENV
    );
});

// 404 Handler
app.use((req: Request, res: Response) => {
    ResponseHandler.fail(
        res, {}, status.NOT_FOUND,
        commonResponses.fail.RESOURCE_NOT_FOUND
    );
});

export default app;