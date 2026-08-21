import fs from 'fs';
import path from 'path';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';

export function getCleanInitialPosts(): BlogPost[] {
  return [
    {
      id: "post_1787332276274_4rpnx",
      title: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google",
      subtitle: "Como transformar a tendência em crescimento real, autoridade no Google e conversões previsíveis para o seu negócio.",
      slug: "como-usar-inteligncia-artificial-para-escalar-vendas-no-google-ads-e-meta-ads-co",
      contentMarkdown: "# Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\n\nO mercado digital brasileiro evolui em velocidade recorde. Diariamente, novas tecnologias, inteligência artificial e atualizações nos algoritmos dos mecanismos de busca criam novos comportamentos de consumo e novos padrões de tomada de decisão. Recentemente, a pauta **\"Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\"** alcançou destaque expressivo nas buscas do Google, chamando a atenção de gestores, empresários e líderes de mercado.\n\nPara empresas que atuam de forma amadora, uma tendência em alta é encarada apenas como uma novidade passageira. No entanto, na metodologia de **Growth e Performance da Prime Rank Marketing**, cada movimento de alta demanda representa uma oportunidade de ouro para **capturar tráfego altamente qualificado, construir autoridade inquestionável no seu segmento e gerar um fluxo previsível de vendas diárias**.\n\nNeste guia completo e aprofundado, você vai entender os bastidores dessa tendência, o impacto direto no comportamento de compra do seu público e o passo a passo prático para transformar essa atenção do mercado em contratos assinados e faturamento real para o seu negócio.",
      excerpt: "A alta recente de buscas por Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads revela uma oportunidade para marcas que desejam se posicionar no topo do Google e converter atenção em clientes reais.",
      featuredImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Guia Estratégico sobre Como Usar Inteligência Artificial",
      status: "published",
      trendSource: {
        topic: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads",
        discoveredAt: "2026-08-21T17:11:16.274Z"
      },
      seo: {
        metaTitle: "Como Usar Inteligência Artificial para Escalar Vendas no...",
        metaDescription: "Descubra o impacto de Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads no comportamento do consumidor...",
        slug: "como-usar-inteligncia-artificial-para-escalar-vendas-no-google-ads-e-meta-ads-co",
        primaryKeyword: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads",
        secondaryKeywords: ["SEO", "Tráfego Pago", "Marketing Digital"],
        readingTimeMinutes: 11,
        wordCount: 2200
      },
      category: "Marketing Digital & SEO",
      tags: ["SEO", "Google Trends", "Marketing Digital", "Growth"],
      author: {
        name: "Equipe Editorial Prime Rank",
        role: "Estrategistas de SEO & Growth Marketing"
      },
      createdAt: "2026-08-21T17:11:16.274Z",
      updatedAt: "2026-08-21T17:11:24.553Z",
      publishedAt: "2026-08-21T17:11:24.553Z"
    },
    {
      id: "post_1787330789567_tlawo",
      title: "IA muda regras da busca do Google e transforma o SEO: como as empresas podem ser encontradas agora?",
      subtitle: "Como transformar a nova busca impulsionada por IA no Google em posicionamento estratégico, autoridade de marca e novos clientes para o seu negócio.",
      slug: "ia-muda-regras-da-busca-do-google-e-transforma-o-seo-como-as-empresas-podem-ser-",
      contentMarkdown: "# IA muda regras da busca do Google e transforma o SEO: como as empresas podem ser encontradas agora?\n\nO ecossistema de buscas do Google passa pela sua transformação mais profunda nas últimas duas décadas. Com a expansão do Google Search Generative Experience (SGE), a integração de resumos de Inteligência Artificial diretamente no topo dos resultados e as constantes atualizações de algoritmos focados em experiência, a forma como os consumidores buscam mudou radicalmente.",
      excerpt: "A evolução da busca com Inteligência Artificial no Google transforma o SEO. Descubra como ajustar o posicionamento da sua empresa para capturar tráfego qualificado e converter leitores em clientes.",
      featuredImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "IA muda regras da busca do Google por Prime Rank Marketing",
      status: "published",
      trendSource: {
        topic: "IA muda regras da busca do Google e transforma o SEO",
        discoveredAt: "2026-08-21T13:40:00.000Z"
      },
      seo: {
        metaTitle: "IA muda regras da busca do Google e transforma o SEO",
        metaDescription: "Entenda como a Inteligência Artificial altera os resultados de busca do Google e como a Prime Rank posiciona sua empresa no topo das pesquisas.",
        slug: "ia-muda-regras-da-busca-do-google-e-transforma-o-seo-como-as-empresas-podem-ser-",
        primaryKeyword: "IA muda regras da busca do Google",
        secondaryKeywords: ["SEO", "Google AI", "Growth Marketing"],
        readingTimeMinutes: 8,
        wordCount: 1650
      },
      category: "Marketing Digital & SEO",
      tags: ["SEO", "Google Trends", "Inteligência Artificial"],
      author: {
        name: "Equipe Editorial Prime Rank",
        role: "Estrategistas de SEO & Growth Marketing"
      },
      createdAt: "2026-08-21T13:40:00.000Z",
      updatedAt: "2026-08-21T13:40:00.000Z",
      publishedAt: "2026-08-21T13:40:00.000Z"
    },
    {
      id: "post_1787282975825_ep7et",
      title: "Como Dominar a 1ª Página do Google na Região Metropolitana do Recife: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google",
      subtitle: "Como transformar a tendência em crescimento real, autoridade no Google e conversões previsíveis para o seu negócio.",
      slug: "como-dominar-a-1-pagina-do-google-na-regiao-metropolitana-do-recife-como-empresa",
      contentMarkdown: "# Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\n\nO mercado digital brasileiro evolui em velocidade recorde. Diariamente, novas tecnologias, inteligência artificial e atualizações nos algoritmos dos mecanismos de busca criam novos comportamentos de consumo e novos padrões de tomada de decisão. Recentemente, a pauta **\"Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\"** alcançou destaque expressivo nas buscas do Google.",
      excerpt: "A alta recente de buscas por Como Dominar a 1ª Página do Google na Região Metropolitana do Recife revela uma oportunidade para marcas que desejam se posicionar no topo do Google e converter atenção em clientes reais.",
      featuredImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Guia Estratégico sobre Como Dominar a 1ª Página do Google na Região Metropolitana do Recife",
      status: "published",
      trendSource: {
        topic: "Como Dominar a 1ª Página do Google na Região Metropolitana do Recife",
        discoveredAt: "2026-08-21T03:29:35.823Z"
      },
      seo: {
        metaTitle: "Como Dominar a 1ª Página do Google na Região...",
        metaDescription: "Descubra o impacto de Como Dominar a 1ª Página do Google na Região Metropolitana do Recife no comportamento do consumidor...",
        slug: "como-dominar-a-1-pagina-do-google-na-regiao-metropolitana-do-recife-como-empresa",
        primaryKeyword: "Como Dominar a 1ª Página do Google na Região Metropolitana do Recife",
        secondaryKeywords: ["SEO", "Tráfego Pago"],
        readingTimeMinutes: 11,
        wordCount: 2194
      },
      category: "Marketing Digital & SEO",
      tags: ["SEO", "Google Trends", "Marketing Digital"],
      author: {
        name: "Equipe Editorial Prime Rank",
        role: "Estrategistas de SEO & Growth Marketing"
      },
      createdAt: "2026-08-21T03:29:35.825Z",
      updatedAt: "2026-08-21T03:29:35.825Z",
      publishedAt: "2026-08-21T03:29:35.827Z"
    }
  ];
}

const BUNDLED_DB_FILE = path.resolve(process.cwd(), 'data', 'blog_storage.json');
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'data');
const DB_FILE = process.env.VERCEL ? path.join(DATA_DIR, 'blog_storage.json') : BUNDLED_DB_FILE;

export class StorageService {
  private static instance: StorageService;
  private db: StorageDatabase;

  private constructor() {
    this.ensureDataDirectory();
    this.db = this.loadDatabase();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private ensureDataDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn('Aviso ao inicializar diretório de dados:', err);
    }
  }

  private loadDatabase(): StorageDatabase {
    const base = getCleanInitialPosts();
    let filePosts: BlogPost[] = [];

    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const tmpDb = JSON.parse(content);
        if (Array.isArray(tmpDb.posts)) {
          filePosts = tmpDb.posts;
        }
      } catch (_) {}
    }

    const postMap = new Map<string, BlogPost>();
    base.forEach((p) => postMap.set(p.id, { ...p, status: 'published' }));

    filePosts.forEach((p) => {
      if (p && p.id && !postMap.has(p.id)) {
        if (p.title && (p.contentMarkdown || p.excerpt)) {
          postMap.set(p.id, {
            ...p,
            status: (p.status || 'pending_approval') as PostStatus,
          });
        }
      }
    });

    const posts = Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      posts,
      trendsHistory: [],
      systemSettings: {
        autoGenerate: true,
        telegramEnabled: true
      }
    };
  }

  private saveLocalDatabase() {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar localmente:', err);
    }
  }

  private async saveDatabase() {
    this.saveLocalDatabase();
  }

  // --- Posts Methods ---

  public getAllPosts(): BlogPost[] {
    const base = getCleanInitialPosts();
    let memoryPosts: BlogPost[] = [];

    if (this.db && Array.isArray(this.db.posts) && this.db.posts.length > 0) {
      memoryPosts = this.db.posts;
    }

    const postMap = new Map<string, BlogPost>();
    base.forEach((p) => postMap.set(p.id, { ...p, status: 'published' }));

    memoryPosts.forEach((p) => {
      if (p && p.id && !postMap.has(p.id)) {
        if (p.title && (p.contentMarkdown || p.excerpt)) {
          postMap.set(p.id, {
            ...p,
            status: (p.status || 'pending_approval') as PostStatus,
          });
        }
      }
    });

    return Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getPostsByStatus(status: PostStatus): BlogPost[] {
    const targetStatus = (status || '').toString().trim().toLowerCase();
    const all = this.getAllPosts();
    return all.filter((p) => (p.status || 'published').toString().trim().toLowerCase() === targetStatus);
  }

  public getPostById(id: string): BlogPost | undefined {
    return this.getAllPosts().find((p) => p.id === id);
  }

  public async findPostById(id: string): Promise<BlogPost | undefined> {
    return this.getPostById(id);
  }

  public getPostBySlug(slug: string): BlogPost | undefined {
    return this.getAllPosts().find((p) => p.slug === slug);
  }

  public savePost(post: BlogPost): BlogPost {
    if (!this.db || !Array.isArray(this.db.posts)) {
      this.db = this.loadDatabase();
    }
    const existingIndex = this.db.posts.findIndex((p) => p.id === post.id);
    post.updatedAt = new Date().toISOString();

    if (existingIndex >= 0) {
      this.db.posts[existingIndex] = post;
    } else {
      this.db.posts.unshift(post);
    }

    this.saveDatabase();
    return post;
  }

  public async updatePostStatus(id: string, status: PostStatus, notes?: string): Promise<BlogPost | null> {
    let post = this.getPostById(id);
    if (!post) return null;

    post.status = status;
    post.updatedAt = new Date().toISOString();

    if (status === 'approved') {
      post.approvedAt = new Date().toISOString();
    } else if (status === 'published') {
      if (!post.approvedAt) post.approvedAt = new Date().toISOString();
      post.publishedAt = new Date().toISOString();
    }

    if (notes) {
      post.validationNotes = notes;
    }

    this.savePost(post);
    return post;
  }

  public async deletePost(id: string): Promise<boolean> {
    if (!this.db || !Array.isArray(this.db.posts)) {
      this.db = this.loadDatabase();
    }
    const initialLen = this.db.posts.length;
    this.db.posts = this.db.posts.filter((p) => p.id !== id);
    const deleted = this.db.posts.length !== initialLen;
    if (deleted) {
      await this.saveDatabase();
    }
    return deleted;
  }

  // --- Trends Methods ---

  public getRecentTrends(limit = 20): TrendTopic[] {
    if (!this.db || !Array.isArray(this.db.trendsHistory)) return [];
    return this.db.trendsHistory.slice(0, limit);
  }

  public saveTrends(trends: TrendTopic[]) {
    if (!this.db || !Array.isArray(this.db.trendsHistory)) {
      this.db = this.loadDatabase();
    }
    const existingIds = new Set(this.db.trendsHistory.map((t) => t.id));
    const newTrends = trends.filter((t) => !existingIds.has(t.id));
    this.db.trendsHistory = [...newTrends, ...this.db.trendsHistory].slice(0, 100);
    this.saveDatabase();
  }
}
