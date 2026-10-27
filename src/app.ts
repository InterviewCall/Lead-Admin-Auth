import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { attchCorrelationMiddleware } from './middlewares/correlationId.middleware.js';

const app = express();

app.use(express.json());
app.use(express.text());

app.use(attchCorrelationMiddleware);

app.get('/health', (_req, res) => {
    res.send({
        status: 'OK'
    });
});

app.use(errorHandler);

export { app };