import express from 'express';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';
import healthRouter from './routes/health.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use('/health', healthRouter);

 
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
