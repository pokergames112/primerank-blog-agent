import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { apiRouter } from './routes/apiRoutes.js';
import { SchedulerJob } from './jobs/scheduler.js';
import { TelegramService } from './services/telegramService.js';

const app = express();
const PORT = process.env.PORT || 3000;

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

// Inicialização dos Serviços em Background
const startServer = (portNumber: number = Number(PORT)) => {
  const server = app.listen(portNumber, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 AGENTE PRIME RANK MARKETING OPERANDO COM SUCESSO!`);
    console.log(`🌐 Painel de Validação Mobile: http://localhost:${portNumber}/dashboard`);
    console.log(`📡 API REST do Blog: http://localhost:${portNumber}/api/blog/posts`);
    console.log(`⚙️  Monitor de Tendências: Ativo`);
    console.log(`======================================================\n`);

    // Inicializa Bot do Telegram
    TelegramService.getInstance();

    // Inicializa Agendador Cron
    const scheduler = SchedulerJob.getInstance();
    scheduler.init();
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[SERVER] Porta ${portNumber} ocupada. Tentando porta ${portNumber + 1}...`);
      startServer(portNumber + 1);
    } else {
      console.error('[SERVER] Erro inesperado ao iniciar servidor:', err);
    }
  });
};

startServer();
