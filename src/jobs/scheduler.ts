import cron from 'node-cron';
import { TrendsService } from '../services/trendsService.js';
import { AiWriterService } from '../services/aiWriterService.js';
import { StorageService } from '../services/storageService.js';
import { TelegramService } from '../services/telegramService.js';
import { WhatsAppService } from '../services/whatsappService.js';

export class SchedulerJob {
  private static instance: SchedulerJob;
  private isRunning = false;

  public static getInstance(): SchedulerJob {
    if (!SchedulerJob.instance) {
      SchedulerJob.instance = new SchedulerJob();
    }
    return SchedulerJob.instance;
  }

  public init() {
    const schedule = process.env.CRON_SCHEDULE || '0 8 * * *'; // Padrão: 8h da manhã diariamente
    const isAuto = process.env.AUTO_DISCOVER_TRENDS !== 'false';

    if (!isAuto) {
      console.log('[CRON] Agendamento automático desativado via AUTO_DISCOVER_TRENDS=false');
      return;
    }

    console.log(`[CRON] Agendador ativo com a frequência: "${schedule}"`);

    cron.schedule(schedule, async () => {
      console.log('[CRON] Executando rotina automática diária de Google Trends...');
      await this.runTrendDiscoveryAndDrafting();
    });
  }

  public async runTrendDiscoveryAndDrafting(customTopicTitle?: string) {
    if (this.isRunning) {
      console.log('[CRON] Já existe um processo de geração em andamento.');
      return;
    }

    this.isRunning = true;
    const trendsService = TrendsService.getInstance();
    const aiWriter = AiWriterService.getInstance();
    const storage = StorageService.getInstance();
    const telegram = TelegramService.getInstance();

    try {
      console.log('[AGENTE] 1. Buscando principais tendências no Google...');
      const trends = await trendsService.fetchTrendingTopics();

      let targetTrend = trends[0];
      if (customTopicTitle) {
        const found = trends.find((t) => t.title.toLowerCase().includes(customTopicTitle.toLowerCase()));
        if (found) {
          targetTrend = found;
        } else {
          targetTrend = {
            id: `custom_${Date.now()}`,
            title: customTopicTitle,
            category: 'Pauta Personalizada',
            discoveredAt: new Date().toISOString(),
            relevanceScore: 99,
          };
        }
      }

      console.log(`[AGENTE] 2. Pauta selecionada: "${targetTrend.title}" (Relevância: ${targetTrend.relevanceScore || 90}%)`);
      console.log(`[AGENTE] 3. Redigindo artigo estruturado (+1500 palavras) com tom da Prime Rank Marketing...`);

      const post = await aiWriter.generateArticleFromTrend(targetTrend);
      storage.savePost(post);

      console.log(`[AGENTE] 4. Artigo criado com sucesso! ID: ${post.id} | Palavras: ${post.seo.wordCount} | Status: ${post.status}`);

      const whatsapp = WhatsAppService.getInstance();
      await whatsapp.notifyNewDraft(post);

      const notifiedTelegram = await telegram.notifyNewDraft(post);
      if (notifiedTelegram) {
        console.log(`[AGENTE] 5. Notificação de validação enviada ao celular pelo Telegram!`);
      } else {
        console.log(`[AGENTE] 5. Rascunho pronto para validação no Dashboard Web Mobile`);
      }

      return post;
    } catch (err) {
      console.error('[AGENTE] Erro durante o fluxo de geração autônoma:', err);
      throw err;
    } finally {
      this.isRunning = false;
    }
  }
}
