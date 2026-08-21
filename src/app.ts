import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { apiRouter } from './routes/apiRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos do Dashboard Web Mobile
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));
app.use('/dashboard', express.static(path.join(publicDir, 'dashboard')));

// Rotas da API
app.use('/api', apiRouter);

// Redirecionamento da raiz para o Dashboard
app.get('/', (_req, res) => {
  res.redirect('/dashboard');
});

export default app;
