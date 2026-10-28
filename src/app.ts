import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { attchCorrelationMiddleware } from './middlewares/correlationId.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        credentials: true,
    }),
);


app.use(express.json());
app.use(express.text());

app.use(attchCorrelationMiddleware);

app.get('/health', (_req, res) => {
    res.send({
        status: 'OK'
    });
});

app.use('/api', apiRouter);

app.use(errorHandler);

export { app };