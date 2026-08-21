import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes/apiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));
app.use('/dashboard', express.static(path.join(publicDir, 'dashboard')));

// Rotas da API
app.use('/api', apiRouter);

// Rota direta do Dashboard
app.get(['/', '/dashboard', '/dashboard/index.html'], (_req, res) => {
  const dashboardFile = path.join(publicDir, 'dashboard', 'index.html');
  const rootIndex = path.join(publicDir, 'index.html');

  if (fs.existsSync(dashboardFile)) {
    return res.sendFile(dashboardFile);
  }
  if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  }
  res.send('<h1>Prime Rank Marketing AI Engine</h1><p>API operando com sucesso.</p>');
});

export default app;
