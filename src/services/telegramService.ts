import TelegramBot from 'node-telegram-bot-api';
import { BlogPost } from '../types/index.js';
import { StorageService } from './storageService.js';
import { TrendsService } from './trendsService.js';
import { AiWriterService } from './aiWriterService.js';

export class TelegramService {
  private static instance: TelegramService;
  private bot: TelegramBot | null = null;
  private adminChatId: string | null = null;
  private isInitialized = false;

  private constructor() {
    this.initBot();
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private initBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || null;

    if (!token || token.trim() === '' || token === 'SEU_TELEGRAM_BOT_TOKEN') {
      console.log('[TELEGRAM] Token não informado no .env. Validação mobile operando primariamente via Dashboard Web.');
      return;
    }

    try {
      this.bot = new TelegramBot(token.trim(), { polling: true });
      this.isInitialized = true;
      console.log('[TELEGRAM] Bot do Telegram conectado com sucesso para aprovação no celular!');

      this.setupHandlers();
    } catch (err) {
      console.error('[TELEGRAM] Falha ao inicializar bot do Telegram:', err);
    }
  }

  private setupHandlers() {
    if (!this.bot) return;

    // Comando /start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcome = `👋 *Olá! Bem-vindo ao Agente de Blog da Prime Rank Marketing.*\n\n` +
        `Eu sou seu assistente de publicação autônoma. Aqui você pode:\n` +
        `• Receber notificações de novos artigos baseados nas tendências do Google\n` +
        `• Aprovar ou descartar pautas com 1 toque no celular\n` +
        `• Gerar novos artigos sob demanda\n\n` +
        `📌 *Seu Chat ID:* \`${chatId}\`\n_(Adicione este número em TELEGRAM_ADMIN_CHAT_ID no arquivo .env)_\n\n` +
        `Comandos úteis:\n` +
        `• /pendentes - Ver rascunhos aguardando sua validação\n` +
        `• /trends - Ver as tendências do Google em alta agora\n` +
        `• /gerar - Buscar pauta e gerar novo artigo de 1500 palavras\n` +
        `• /status - Ver métricas de posts publicados`;

      this.bot?.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
    });

    // Comando /pendentes
    this.bot.onText(/\/pendentes/, async (msg) => {
      const storage = StorageService.getInstance();
      const pending = storage.getPostsByStatus('pending_approval');

      if (pending.length === 0) {
        this.bot?.sendMessage(msg.chat.id, '✅ *Nenhum post pendente de aprovação no momento.* Todos os rascunhos já foram validados ou descartados.', {
          parse_mode: 'Markdown',
        });
        return;
      }

      this.bot?.sendMessage(msg.chat.id, `📋 *Você tem ${pending.length} post(s) aguardando validação:*`, { parse_mode: 'Markdown' });

      for (const post of pending.slice(0, 3)) {
        await this.sendApprovalCard(post, msg.chat.id.toString());
      }
    });

    // Comando /trends
    this.bot.onText(/\/trends/, async (msg) => {
      const trendsService = TrendsService.getInstance();
      this.bot?.sendMessage(msg.chat.id, '🔎 *Buscando tendências mais recentes do Google Brasil...*', { parse_mode: 'Markdown' });

      const trends = await trendsService.fetchTrendingTopics();
      const top = trends.slice(0, 5);

      let text = `🔥 *TOP 5 Tendências no Google (Hoje):*\n\n`;
      top.forEach((t, i) => {
        text += `${i + 1}. *${t.title}*\n   📊 Buscas: ${t.approximateTraffic || 'Em alta'}\n   🎯 Relevância: ${t.relevanceScore}%\n\n`;
      });

      this.bot?.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
    });

    // Comando /gerar
    this.bot.onText(/\/gerar/, async (msg) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(chatId, '⚙️ *Iniciando criação autônoma...*\n1. Monitorando Google Trends\n2. Adaptando para Prime Rank Marketing\n3. Redigindo artigo (+1500 palavras)...', { parse_mode: 'Markdown' });

      try {
        const trendsService = TrendsService.getInstance();
        const aiWriter = AiWriterService.getInstance();
        const storage = StorageService.getInstance();

        const trends = await trendsService.fetchTrendingTopics();
        const topTrend = trends[0];

        const newPost = await aiWriter.generateArticleFromTrend(topTrend);
        storage.savePost(newPost);

        await this.sendApprovalCard(newPost, chatId.toString());
      } catch (err: any) {
        this.bot?.sendMessage(chatId, `❌ Erro ao gerar artigo: ${err.message}`);
      }
    });

    // Manipulação dos Botões Inline de Validação
    this.bot.on('callback_query', async (query) => {
      const data = query.data;
      if (!data) return;

      const storage = StorageService.getInstance();
      const [action, postId] = data.split(':');

      const post = storage.getPostById(postId);
      if (!post) {
        this.bot?.answerCallbackQuery(query.id, { text: 'Post não encontrado ou já excluído.' });
        return;
      }

      const host = process.env.HOST || 'http://localhost:3000';

      if (action === 'approve') {
        storage.updatePostStatus(postId, 'published', 'Aprovado via celular pelo Telegram');
        this.bot?.answerCallbackQuery(query.id, { text: '🚀 Artigo APROVADO e publicado com sucesso!' });
        this.bot?.editMessageText(
          `✅ *ARTIGO PUBLICADO COM SUCESSO!*\n\n` +
          `📌 *Título:* ${post.title}\n` +
          `📝 *Palavras:* ${post.seo.wordCount}\n` +
          `🔗 *Slug:* \`${post.slug}\`\n` +
          `🌐 *Disponível na API do Blog:* ${host}/api/blog/posts/${post.slug}`,
          {
            chat_id: query.message?.chat.id,
            message_id: query.message?.message_id,
            parse_mode: 'Markdown',
          }
        );
      } else if (action === 'reject') {
        storage.updatePostStatus(postId, 'rejected', 'Rejeitado via celular pelo Telegram');
        this.bot?.answerCallbackQuery(query.id, { text: 'Post descartado.' });
        this.bot?.editMessageText(`❌ *Post descartado pelo usuário.*\n\nTema: "${post.title}"`, {
          chat_id: query.message?.chat.id,
          message_id: query.message?.message_id,
          parse_mode: 'Markdown',
        });
      } else if (action === 'regenerate') {
        this.bot?.answerCallbackQuery(query.id, { text: 'Regerando artigo com novo ângulo...' });
        if (query.message?.chat.id) {
          this.bot?.sendMessage(query.message.chat.id, `🔄 *Regerando versão ampliada para:* "${post.trendSource?.topic || post.title}"...`, { parse_mode: 'Markdown' });
          const aiWriter = AiWriterService.getInstance();
          const trend = {
            id: post.id,
            title: post.trendSource?.topic || post.title,
            category: post.category,
            discoveredAt: new Date().toISOString(),
          };
          const regenerated = await aiWriter.generateArticleFromTrend(trend, 'Crie uma versão ainda mais aprofundada com novos dados e exemplos práticos');
          storage.savePost(regenerated);
          await this.sendApprovalCard(regenerated, query.message.chat.id.toString());
        }
      }
    });
  }

  /**
   * Envia o cartão de validação com botões no celular
   */
  public async notifyNewDraft(post: BlogPost): Promise<boolean> {
    const targetChatId = this.adminChatId;
    if (!this.bot || !targetChatId) {
      return false;
    }
    return this.sendApprovalCard(post, targetChatId);
  }

  private async sendApprovalCard(post: BlogPost, chatId: string): Promise<boolean> {
    if (!this.bot) return false;

    const host = process.env.HOST || 'http://localhost:3000';
    const webReviewUrl = `${host}/dashboard/#review-${post.id}`;

    const text =
      `📢 *NOVO ARTIGO PRONTO PARA VALIDAÇÃO!*\n\n` +
      `🔥 *Tendência:* _${post.trendSource?.topic || post.title}_\n` +
      `📌 *Título:* *${post.title}*\n\n` +
      `📖 *Resumo:* ${post.excerpt.slice(0, 200)}...\n\n` +
      `📊 *Métricas:* \n` +
      `• Extensão: *${post.seo.wordCount} palavras* (Atende meta +1500)\n` +
      `• Tempo de Leitura: *${post.seo.readingTimeMinutes} min*\n` +
      `• Foco de Marca: *Prime Rank Marketing*\n\n` +
      `Valide abaixo no seu celular com 1 toque:`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '🚀 Aprovar & Publicar', callback_data: `approve:${post.id}` },
          { text: '❌ Descartar', callback_data: `reject:${post.id}` },
        ],
        [
          { text: '🔄 Regerar Artigo', callback_data: `regenerate:${post.id}` },
          { text: '📱 Abrir no Web App', url: webReviewUrl },
        ],
      ],
    };

    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      });
      return true;
    } catch (err) {
      console.error('[TELEGRAM] Erro ao enviar cartão de aprovação:', err);
      return false;
    }
  }
}
