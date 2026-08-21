import express from 'express';
import cors from 'cors';
import { apiRouter } from '../src/routes/apiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Montar rotas do agente
app.use('/api', apiRouter);
app.use(apiRouter);

export default app;
