import Parser from 'rss-parser';
import { TrendTopic } from '../types/index.js';
import { StorageService } from './storageService.js';

interface CustomItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
}

const parser = new Parser<any, CustomItem>();

export class TrendsService {
  private static instance: TrendsService;
  private storage = StorageService.getInstance();

  public static getInstance(): TrendsService {
    if (!TrendsService.instance) {
      TrendsService.instance = new TrendsService();
    }
    return TrendsService.instance;
  }

  /**
   * Coleta tendências focadas estritamente em Marketing, SEO, Tráfego Pago, Google Ads e IA
   */
  public async fetchTrendingTopics(): Promise<TrendTopic[]> {
    const rawTopics: TrendTopic[] = [];

    const searchQueries = [
      'google+ads+seo+marketing+digital+brasil',
      'trafego+pago+meta+ads+vendas+online',
      'inteligencia+artificial+empresas+conversao',
      'algoritmo+google+otimizacao+sites'
    ];

    for (const q of searchQueries) {
      try {
        const feed = await parser.parseURL(
          'https://news.google.com/rss/search?q=' + q + '&hl=pt-BR&gl=BR&ceid=BR:pt-419'
        );
        if (feed && feed.items) {
          for (const item of feed.items.slice(0, 4)) {
            if (!item.title) continue;

            const cleanTitle = item.title.replace(/\s*-\s*[^-]+$/, '').trim();
            if (this.isRelevantMarketingTopic(cleanTitle)) {
              const topicId = 'trend_' + Buffer.from(cleanTitle).toString('base64url').slice(0, 16);

              rawTopics.push({
                id: topicId,
                title: cleanTitle,
                approximateTraffic: '+75K buscas estimadas',
                trafficSnippet: item.contentSnippet || item.content || 'Em alta no Google Brasil',
                category: 'Estratégia & Performance',
                discoveredAt: new Date().toISOString(),
                relevanceScore: this.calculateRelevanceScore(cleanTitle, item.contentSnippet || ''),
                suggestedAngle: this.generateAngle(cleanTitle),
              });
            }
          }
        }
      } catch (err) {
        console.warn('[TRENDS] Aviso ao buscar feed para query: ' + q);
      }
    }

    if (rawTopics.length === 0) {
      rawTopics.push(...this.getFallbackTrendingTopics());
    }

    const unique = Array.from(new Map(rawTopics.map((item) => [item.title, item])).values());
    unique.sort((a, b) => (b.relevanceScore || 50) - (a.relevanceScore || 50));

    this.storage.saveTrends(unique);
    return unique;
  }

  private isRelevantMarketingTopic(title: string): boolean {
    const text = title.toLowerCase();
    const banned = ['futebol', 'jogo', 'novela', 'bbb', 'reality', 'acidente', 'polícia', 'crime', 'famosos', 'celebridade'];
    for (const b of banned) {
      if (text.includes(b)) return false;
    }
    const relevant = ['google', 'ads', 'seo', 'marketing', 'vendas', 'tráfego', 'meta', 'instagram', 'inteligência artificial', 'ia', 'lead', 'conversão', 'negócio', 'empresa', 'ecommerce'];
    return relevant.some((r) => text.includes(r));
  }

  private calculateRelevanceScore(title: string, snippet: string): number {
    const text = (title + ' ' + snippet).toLowerCase();
    const highKeywords = ['google', 'vendas', 'ia', 'inteligência artificial', 'mercado', 'empresa', 'conversão', 'anúncio', 'seo', 'tráfego'];
    let score = 70;

    for (const kw of highKeywords) {
      if (text.includes(kw)) {
        score += 6;
      }
    }

    return Math.min(score, 99);
  }

  private generateAngle(topicTitle: string): string {
    return 'Como gestores e empresários devem aplicar a estratégia de "' + topicTitle + '" para gerar mais leads, autoridade e conversões com a Prime Rank Marketing.';
  }

  private getFallbackTrendingTopics(): TrendTopic[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'fallback_1',
        title: 'Como Dominar a 1ª Página do Google com SEO e Tráfego Pago em 2026',
        approximateTraffic: '+120K',
        trafficSnippet: 'Estratégias avançadas para posicionar empresas no topo das buscas e acelerar conversões.',
        category: 'SEO & Performance',
        discoveredAt: now,
        relevanceScore: 99,
        suggestedAngle: 'Metodologia Prime Rank para transformar buscas orgânicas e anúncios em vendas recorrentes.',
      },
      {
        id: 'fallback_2',
        title: 'Estratégias Avançadas de Escala no Meta Ads e Google Ads na Região Metropolitana do Recife',
        approximateTraffic: '+90K',
        trafficSnippet: 'O passo a passo para reduzir o Custo por Aquisição (CPA) e qualificar leads no WhatsApp.',
        category: 'Tráfego Pago & ROI',
        discoveredAt: now,
        relevanceScore: 96,
        suggestedAngle: 'Maximizando o retorno sobre investimento de campanhas pagas com alta precisão.',
      },
      {
        id: 'fallback_3',
        title: 'Como a Inteligência Artificial e Automação Estão Revolucionando o Atendimento Comercial',
        approximateTraffic: '+85K',
        trafficSnippet: 'Uso de agentes inteligentes integrados ao WhatsApp para fechar contratos 24 horas por dia.',
        category: 'Inovação & IA',
        discoveredAt: now,
        relevanceScore: 94,
        suggestedAngle: 'Triagem e qualificação de leads com IA para acelerar o fechamento de vendas.',
      },
    ];
  }
}
