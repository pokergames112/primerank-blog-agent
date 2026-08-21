import axios from 'axios';
import { BlogPost } from '../types/index.js';

export class WhatsAppService {
  private static instance: WhatsAppService;
  private adminPhone: string | null = null;
  private apiUrl: string | null = null;
  private apiToken: string | null = null;

  private constructor() {
    this.adminPhone = process.env.WHATSAPP_ADMIN_PHONE || '5581986703728';
    this.apiUrl = process.env.WHATSAPP_API_URL || null;
    this.apiToken = process.env.WHATSAPP_API_TOKEN || null;
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  /**
   * Envia uma notificação no WhatsApp quando um novo artigo é gerado
   */
  public async notifyNewDraft(post: BlogPost): Promise<boolean> {
    const phone = process.env.WHATSAPP_ADMIN_PHONE || this.adminPhone;
    if (!phone) {
      console.log('[WHATSAPP] Número de telefone não informado no .env.');
      return false;
    }

    const host = (process.env.HOST && !process.env.HOST.includes('localhost'))
      ? process.env.HOST.replace(/\/$/, '')
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/\/$/, '')}` : 'https://primerank-blog-agent.vercel.app');

    const reviewUrl = `${host}/dashboard/#review-${post.id}`;
    const siteUrl = `https://pokergames112.github.io/primerankmarketing.com.br/post.html?slug=${encodeURIComponent(post.slug)}`;

    const message =
      `🤖 *AGENTE DE BLOG - PRIME RANK MARKETING*\n\n` +
      `📢 *NOVO ARTIGO GERADO PARA VALIDAÇÃO!*\n\n` +
      `🔥 *Tendência:* _${post.trendSource?.topic || post.title}_\n` +
      `📌 *Título:* *${post.title}*\n\n` +
      `📊 *Métricas de SEO:*\n` +
      `• Extensão: *${post.seo.wordCount} palavras*\n` +
      `• Tempo de Leitura: *${post.seo.readingTimeMinutes} min*\n` +
      `• Categoria: *${post.category}*\n\n` +
      `📖 *Resumo:* ${post.excerpt.slice(0, 180)}...\n\n` +
      `📱 *Aprovar ou Editar no Celular:* \n${reviewUrl}\n\n` +
      `🌐 *Prévia no Site:* \n${siteUrl}`;

    console.log(`[WHATSAPP] Notificação preparada para o número: ${phone}`);

    // Se houver uma API de WhatsApp configurada no .env (Evolution API, UltraMsg, Z-API, Twilio, etc.)
    if (this.apiUrl && this.apiToken) {
      try {
        await axios.post(
          this.apiUrl,
          {
            number: phone,
            phone: phone,
            message: message,
            text: message,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiToken}`,
              apikey: this.apiToken,
            },
            timeout: 8000,
          }
        );
        console.log('[WHATSAPP] Notificação enviada com sucesso via API!');
        return true;
      } catch (err: any) {
        console.warn('[WHATSAPP] Aviso ao enviar via API de WhatsApp:', err.message);
      }
    }

    return false;
  }

  /**
   * Gera um link 'click-to-chat' de wa.me para compartilhamento manual rápido
   */
  public generateDirectWhatsAppLink(post: BlogPost): string {
    const host = (process.env.HOST && !process.env.HOST.includes('localhost'))
      ? process.env.HOST.replace(/\/$/, '')
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/\/$/, '')}` : 'https://primerank-blog-agent.vercel.app');

    const reviewUrl = `${host}/dashboard/#review-${post.id}`;
    const text = encodeURIComponent(`🚀 *Novo Artigo para Aprovar:* "${post.title}"\n\nAcesse para editar ou publicar:\n${reviewUrl}`);
    const phone = process.env.WHATSAPP_ADMIN_PHONE || '5581986703728';
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  }
}
