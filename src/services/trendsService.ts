import Parser from 'rss-parser';
import { TrendTopic } from '../types/index.js';
import { StorageService } from './storageService.js';

interface CustomItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  'ht:approx_traffic'?: string;
  'ht:news_item'?: any;
  'ht:news_item_title'?: string;
  'ht:news_item_snippet'?: string;
  'ht:news_item_url'?: string;
  'ht:news_item_source'?: string;
}

const parser = new Parser<any, CustomItem>({
  customFields: {
    item: [
      ['ht:approx_traffic', 'approx_traffic'],
      ['ht:news_item', 'news_item'],
      ['ht:news_item_title', 'news_item_title'],
      ['ht:news_item_snippet', 'news_item_snippet'],
      ['ht:news_item_url', 'news_item_url'],
      ['ht:news_item_source', 'news_item_source'],
    ],
  },
});

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
   * Coleta as principais tendências do Google Trends (Brasil) e Notícias de Alta Demanda,
   * filtrando e adaptando estritamente para o nicho de Marketing, SEO, Tráfego e Vendas da Prime Rank.
   */
  public async fetchTrendingTopics(): Promise<TrendTopic[]> {
    const rawTopics: TrendTopic[] = [];

    // 1. Feeds de Busca Estratégica do Google Brasil em tempo real
    const searchQueries = [
      'google+ads+OR+seo+OR+trafego+pago+OR+inteligencia+artificial+negocios',
      'marketing+digital+brasil+OR+vendas+online+OR+conversao+leads',
      'algoritmo+google+OR+meta+ads+OR+instagram+empresas'
    ];

    for (const q of searchQueries) {
      try {
        const feed = await parser.parseURL(
          `https://news.google.com/rss/search?q=${q}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
        );
        if (feed && feed.items) {
          for (const item of feed.items.slice(0, 5)) {
            if (!item.title) continue;

            const cleanTitle = item.title.replace(/\s*-\s*[^-]+$/, '').trim();
            const topicId = `trend_${Buffer.from(cleanTitle).toString('base64url').slice(0, 16)}`;

            rawTopics.push({
              id: topicId,
              title: cleanTitle,
              approximateTraffic: '+80K buscas estimadas',
              trafficSnippet: item.contentSnippet || item.content || 'Em alta no Google Brasil',
              category: 'Tendência de Mercado & SEO',
              discoveredAt: new Date().toISOString(),
              relevanceScore: this.calculateRelevanceScore(cleanTitle, item.contentSnippet || ''),
              suggestedAngle: this.generateAngle(cleanTitle),
            });
          }
        }
      } catch (err) {
        console.warn(`[TRENDS] Aviso ao buscar feed para query: ${q}`);
      }
    }

    // 2. Google Trends Brasil Geral (Captura grandes ondas do dia)
    try {
      const feed = await parser.parseURL('https://trends.google.com/trending/rss?geo=BR');
      if (feed && feed.items) {
        for (const item of feed.items.slice(0, 8)) {
          if (!item.title) continue;

          const title = item.title.trim();
          const topicId = `gtrend_${Buffer.from(title).toString('base64url').slice(0, 16)}`;
          const snippet = (item as any).news_item_snippet || item.content || '';

          rawTopics.push({
            id: topicId,
            title: title,
            approximateTraffic: (item as any).approx_traffic || '+100K',
            trafficSnippet: snippet,
            category: 'Google Trends Viral',
            discoveredAt: new Date().toISOString(),
            relevanceScore: this.calculateRelevanceScore(title, snippet),
            suggestedAngle: `Como empresários e gestores devem usar o pico de atenção em "${title}" para gerar tráfego orgânico e conversões com a Prime Rank Marketing.`,
          });
        }
      }
    } catch (err) {
      console.warn('[TRENDS] Google Trends direto indisponível, usando pautas de alta autoridade.');
    }

    // Fallbacks estratégicos sempre que necessário
    if (rawTopics.length === 0) {
      rawTopics.push(...this.getFallbackTrendingTopics());
    }

    // Elimina duplicados e ordena por maior relevância
    const unique = Array.from(new Map(rawTopics.map((item) => [item.title, item])).values());
    unique.sort((a, b) => (b.relevanceScore || 50) - (a.relevanceScore || 50));

    this.storage.saveTrends(unique);
    return unique;
  }

  private calculateRelevanceScore(title: string, snippet: string): number {
    const text = `${title} ${snippet}`.toLowerCase();
    const highKeywords = ['google', 'vendas', 'ia', 'inteligencia artificial', 'mercado', 'empresa', 'tecnologia', 'consumo', 'marca', 'anuncio', 'e-commerce'];
    let score = 65; // Base score

    for (const kw of highKeywords) {
      if (text.includes(kw)) {
        score += 8;
      }
    }

    return Math.min(score, 98);
  }

  private generateAngle(topicTitle: string): string {
    return `Como aproveitar o impacto e a alta busca por "${topicTitle}" para gerar autoridade, atrair clientes e aplicar estratégias de SEO e Tráfego com a Prime Rank Marketing.`;
  }

  private getFallbackTrendingTopics(): TrendTopic[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'fallback_1',
        title: 'Atualização do Algoritmo do Google e o Futuro do SEO com Busca por IA',
        approximateTraffic: '+100K',
        trafficSnippet: 'Como as novas respostas geradas por IA no Google afetam o tráfego orgânico de empresas e sites.',
        category: 'SEO & Algoritmos',
        discoveredAt: now,
        relevanceScore: 98,
        suggestedAngle: 'Estratégias para proteger e multiplicar seu tráfego orgânico na era das buscas por Inteligência Artificial.',
      },
      {
        id: 'fallback_2',
        title: 'Redução do Custo por Lead (CPL) no Google Ads e Meta Ads em Mercados Competitivos',
        approximateTraffic: '+80K',
        trafficSnippet: 'Estratégias avançadas de segmentação e landing pages de alta conversão para reduzir gastos e aumentar vendas.',
        category: 'Tráfego Pago & ROI',
        discoveredAt: now,
        relevanceScore: 95,
        suggestedAngle: 'O método comprovado da Prime Rank Marketing para maximizar o ROAS sem inflacionar o orçamento de mídia.',
      },
      {
        id: 'fallback_3',
        title: 'Como Empresas B2B e E-commerces Estão Escalando Vendas com Inbound de Alta Performance',
        approximateTraffic: '+60K',
        trafficSnippet: 'A importância de construir autoridade de marca através de conteúdos profundos e funis de captação contínua.',
        category: 'Growth & Vendas',
        discoveredAt: now,
        relevanceScore: 92,
        suggestedAngle: 'Construindo uma máquina de aquisição de clientes diária com marketing de conteúdo estratégico.',
      },
    ];
  }
}
