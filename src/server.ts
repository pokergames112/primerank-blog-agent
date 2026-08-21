import app from './app.js';
import { SchedulerJob } from './jobs/scheduler.js';
import { TelegramService } from './services/telegramService.js';

const PORT = process.env.PORT || 3000;

const startServer = (portNumber: number = Number(PORT)) => {
  const server = app.listen(portNumber, () => {
    console.log('\n======================================================');
    console.log('🤖 AGENTE PRIME RANK MARKETING OPERANDO COM SUCESSO!');
    console.log('📱 Painel de Validação Mobile: http://localhost:' + portNumber + '/dashboard');
    console.log('🔗 API REST do Blog: http://localhost:' + portNumber + '/api/blog/posts');
    console.log('📡 Monitor de Tendências: Ativo');
    console.log('======================================================\n');

    TelegramService.getInstance();
    const scheduler = SchedulerJob.getInstance();
    scheduler.init();
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn('[SERVER] Porta ' + portNumber + ' ocupada. Tentando porta ' + (portNumber + 1) + '...');
      startServer(portNumber + 1);
    } else {
      console.error('[SERVER] Erro inesperado ao iniciar servidor:', err);
    }
  });
};

startServer();
