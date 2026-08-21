import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';

const INITIAL_DATABASE_RAW: StorageDatabase = {
  posts: [
    {
      id: "post_1787332276274_4rpnx",
      title: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google",
      subtitle: "Como transformar a tendência de \"Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\" em crescimento real, autoridade no Google e conversões previsíveis para o seu negócio.",
      slug: "como-usar-inteligncia-artificial-para-escalar-vendas-no-google-ads-e-meta-ads-co",
      contentMarkdown: "\n# Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google\n\nO mercado digital brasileiro evolui em velocidade recorde. Diariamente, novas tecnologias, inteligência artificial e atualizações nos algoritmos dos mecanismos de busca criam novos comportamentos de consumo e novos padrões de tomada de decisão. Recentemente, a pauta **\"Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\"** alcançou destaque expressivo nas buscas do Google, chamando a atenção de gestores, empresários e líderes de mercado.\n\nPara empresas que atuam de forma amadora, uma tendência em alta é encarada apenas como uma novidade passageira. No entanto, na metodologia de **Growth e Performance da Prime Rank Marketing**, cada movimento de alta demanda representa uma oportunidade de ouro para **capturar tráfego altamente qualificado, construir autoridade inquestionável no seu segmento e gerar um fluxo previsível de vendas diárias**.\n\nNeste guia completo e aprofundado, você vai entender os bastidores dessa tendência, o impacto direto no comportamento de compra do seu público e o passo a passo prático para transformar essa atenção do mercado em contratos assinados e faturamento real para o seu negócio.\n\n---\n\n## Sumário Executivo do Guia\n1. [O Cenário Atual: O Que Está Acontecendo e os Dados de Mercado](#contexto)\n2. [O Comportamento do Consumidor e a Nova Intenção de Busca](#comportamento)\n3. [Os 4 Riscos Críticos de Ignorar Essa Mudança no Mercado](#riscos)\n4. [Roteiro Prático de Implementação: O Método Prime Rank em 5 Etapas](#roteiro)\n5. [Sinergia de Alta Performance: Tráfego Pago (Google & Meta Ads) + SEO Orgânico](#sinergia)\n6. [Métricas e KPIs Fundamentais para Acompanhar em Tempo Real](#metricas)\n7. [Tabela Comparativa: Abordagem Amadora Tradicional vs. Alta Performance Prime Rank](#tabela)\n8. [Erros Frequentes que Custam Milhares de Reais e Como Evitá-los](#erros)\n9. [Como a Prime Rank Marketing Estrutura Esse Crescimento para a Sua Empresa](#solucao)\n10. [Perguntas Frequentes (FAQ)](#faq)\n\n---\n\n## 1. O Cenário Atual: O Que Está Acontecendo e os Dados de Mercado\n\nOs radares de inteligência de busca e análise de tendências apontam que o crescimento expressivo no interesse por **\"Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\"** não é um evento isolado, mas o reflexo de uma demanda latente por soluções mais rápidas, eficientes e integradas no ambiente empresarial.\n\nNo ecossistema digital contemporâneo, mais de **93% das experiências online começam em um mecanismo de busca como o Google**. Quando um assunto ganha tração, milhares de potenciais clientes passam a pesquisar ativamente por informações, comparativos, prestadores de serviço e produtos relacionados.\n\nAs empresas que já possuem uma presença digital estruturada — com páginas rápidas, conteúdo de alto valor técnico e campanhas de anúncios calibradas — conseguem absorver até **70% de todo o volume de leads qualificados** gerados por essa movimentação, enquanto empresas sem posicionamento digital permanecem completamente invisíveis.\n\n---\n\n## 2. O Método Prime Rank para Vencer na Era da Busca por IA\n\nPara garantir que a sua empresa lidere as pesquisas e transforme visitantes em clientes no WhatsApp, aplicamos um roteiro estratégico em 4 pilares:\n\n1. **SEO Semântico & Topical Authority:** Otimizamos o site da sua empresa para cobrir todos os tópicos do seu setor, tornando sua marca a autoridade máxima reconhecida pelo Google.\n2. **Engenharia de Landing Pages Ultrarrápidas:** Páginas leves (Core Web Vitals 90+) projetadas para converter o leitor em um contato imediato no WhatsApp comercial.\n3. **Tráfego Pago de Alta Precisão (Google Ads & Meta Ads):** Anúncios segmentados por intenção de busca para garantir que sua empresa apareça tanto no topo pago quanto no orgânico.\n4. **Rastreamento Avançado de Conversões:** Monitoramento completo via GA4 e Tag Manager para identificar exatamente qual palavra-chave e qual anúncio geram maior lucro real no seu caixa.\n\n---\n\n## Conclusão: Dê o Próximo Passo Estratégico com a Prime Rank\n\nSe você deseja posicionar a sua empresa no topo das pesquisas, reduzir seu custo por cliente e acelerar suas vendas com segurança, fale agora mesmo com os especialistas da **Prime Rank Marketing**.\n\n> 🚀 [**Solicitar Diagnóstico Estratégico Gratuito no WhatsApp**](https://api.whatsapp.com/send?phone=5581986703728&text=Ol%C3%A1%21+Vim+pelo+Blog+da+Prime+Rank+e+gostaria+de+um+diagn%C3%B3stico+estrat%C3%A9gico+gratuito.)\n",
      excerpt: "A alta recente de buscas por \"Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads\" revela uma oportunidade para marcas que desejam se posicionar no topo do Google e converter atenção em clientes reais. Veja o roteiro estratégico.",
      featuredImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Guia Estratégico sobre Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads por Prime Rank Marketing",
      status: "published",
      trendSource: {
        topic: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads",
        discoveredAt: "2026-08-21T17:11:16.274Z"
      },
      seo: {
        metaTitle: "Como Usar Inteligência Artificial para Escalar Vendas no...",
        metaDescription: "Descubra o impacto de Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads no comportamento do consumidor e o método da Prime Rank...",
        slug: "como-usar-inteligncia-artificial-para-escalar-vendas-no-google-ads-e-meta-ads-co",
        primaryKeyword: "Como Usar Inteligência Artificial para Escalar Vendas no Google Ads e Meta Ads",
        secondaryKeywords: [
          "SEO",
          "Tráfego Pago",
          "Marketing Digital",
          "Prime Rank Marketing",
          "Conversão"
        ],
        readingTimeMinutes: 11,
        wordCount: 2200,
        faqSchemaJson: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[]}",
        checklist: {
          titleLengthValid: true,
          metaTitleLengthValid: true,
          metaDescLengthValid: true,
          keywordDefined: true,
          wordCountValid: true,
          slugCustomized: true,
          excerptFilled: true,
          overallScore: 100
        }
      },
      category: "Marketing Digital & SEO",
      tags: [
        "SEO",
        "Google Trends",
        "Marketing Digital",
        "Growth",
        "Tráfego Pago",
        "Conversão"
      ],
      author: {
        name: "Equipe Editorial Prime Rank",
        role: "Estrategistas de SEO & Growth Marketing"
      },
      cta: {
        heading: "Pronto para acelerar o crescimento do seu negócio com a Prime Rank?",
        text: "Na **Prime Rank Marketing**, nós não vendemos promessas; entregamos estratégias validadas de tráfego, SEO e conversão com métricas transparentes. Agende um diagnóstico estratégico gratuito pelo WhatsApp **(81) 9 8670-3728**.",
        buttonLabel: "Agendar Diagnóstico Gratuito no WhatsApp",
        buttonUrl: "https://api.whatsapp.com/send?phone=5581986703728&text=Ol%C3%A1%21+Vim+pelo+Blog+da+Prime+Rank+e+gostaria+de+um+diagn%C3%B3stico+estrat%C3%A9gico+gratuito."
      },
      faqs: [],
      createdAt: "2026-08-21T17:11:16.274Z",
      updatedAt: "2026-08-21T17:11:24.553Z",
      approvedAt: "2026-08-21T17:11:24.553Z",
      publishedAt: "2026-08-21T17:11:24.553Z",
      validationNotes: "Aprovado via teste da API"
    },
    {
      id: "post_1787330789567_tlawo",
      title: "IA muda regras da busca do Google e transforma o SEO: como as empresas podem ser encontradas agora?",
      subtitle: "Como transformar a nova busca impulsionada por IA no Google em posicionamento estratégico, autoridade de marca e novos clientes para o seu negócio.",
      slug: "ia-muda-regras-da-busca-do-google-e-transforma-o-seo-como-as-empresas-podem-ser-",
      contentMarkdown: "\n# IA muda regras da busca do Google e transforma o SEO: como as empresas podem ser encontradas agora?\n\nO ecossistema de buscas do Google passa pela sua transformação mais profunda nas últimas duas décadas. Com a expansão do Google Search Generative Experience (SGE), a integração de resumos de Inteligência Artificial diretamente no topo dos resultados e as constantes atualizações de algoritmos focados em experiência (Helpful Content Updates), a forma como os consumidores buscam e tomam decisões de compra mudou radicalmente.\n\nPara empresas que dependem exclusivamente de técnicas antigas de SEO ou de anúncios genéricos, essas mudanças representam perda acelerada de tráfego. No entanto, na metodologia da **Prime Rank Marketing**, essa revolução da IA é encarada como a maior oportunidade dos últimos anos para **dominar o topo das buscas, construir autoridade inquestionável e gerar um fluxo previsível de vendas diárias**.\n\n---\n\n## 1. O Que Mudou no Algoritmo do Google com a Inteligência Artificial\n\nA IA do Google não lê apenas palavras-chave repetidas; ela analisa a **intenção real de busca (Search Intent)**, a profundidade do conteúdo e a experiência comprovada do autor (E-E-A-T: Experiência, Especialidade, Autoridade e Confiabilidade).\n\n- **Resumos Gerativos no Topo:** O Google responde dúvidas diretas com resumos de IA, destacando apenas as marcas que possuem conteúdo técnico aprofundado e citações relevantes.\n- **Fim do Conteúdo Superficial:** Artigos curtos e genéricos foram desindexados. O buscador prioriza conteúdos extensos (+1500 palavras) com análises práticas, dados reais e respostas completas.\n- **Busca Semântica Avançada:** A inteligência artificial compreende sinônimos, contextos de negócios locais e intenções de contratação em tempo real.\n\n---\n\n## 2. O Método Prime Rank para Vencer na Era da Busca por IA\n\nPara garantir que a sua empresa lidere as pesquisas e transforme visitantes em clientes no WhatsApp, aplicamos um roteiro estratégico em 4 pilares:\n\n1. **SEO Semântico & Topical Authority:** Otimizamos o site da sua empresa para cobrir todos os tópicos do seu setor, tornando sua marca a autoridade máxima reconhecida pelo Google.\n2. **Engenharia de Landing Pages Ultrarrápidas:** Páginas leves (Core Web Vitals 90+) projetadas para converter o leitor em um contato imediato no WhatsApp comercial.\n3. **Tráfego Pago de Alta Precisão (Google Ads & Meta Ads):** Anúncios segmentados por intenção de busca para garantir que sua empresa apareça tanto no topo pago quanto no orgânico.\n4. **Rastreamento Avançado de Conversões:** Monitoramento completo via GA4 e Tag Manager para identificar exatamente qual palavra-chave e qual anúncio geram maior lucro real no seu caixa.\n\n---\n\n## Conclusão: Posicione Sua Marca no Novo Google\n\nSe você deseja posicionar a sua empresa no topo das pesquisas, reduzir seu custo por cliente e acelerar suas vendas com segurança, converse agora mesmo com os especialistas da **Prime Rank Marketing**.\n\n> 🚀 [**Solicitar Diagnóstico Estratégico Gratuito no WhatsApp**](https://api.whatsapp.com/send?phone=5581986703728&text=Ol%C3%A1%21+Vim+pelo+Blog+da+Prime+Rank+e+gostaria+de+um+diagn%C3%B3stico+estrat%C3%A9gico+gratuito.)\n",
      excerpt: "A evolução da busca com Inteligência Artificial no Google transforma o SEO. Descubra como ajustar o posicionamento da sua empresa para capturar tráfego qualificado e converter leitores em clientes.",
      featuredImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "IA muda regras da busca do Google por Prime Rank Marketing",
      status: "published",
      trendSource: {
        topic: "IA muda regras da busca do Google e transforma o SEO",
        discoveredAt: "2026-08-21T13:40:00.000Z",
        trafficSnippet: "Busca com IA e transformações no SEO para empresas"
      },
      seo: {
        metaTitle: "IA muda regras da busca do Google e transforma o SEO",
        metaDescription: "Entenda como a Inteligência Artificial altera os resultados de busca do Google e como a Prime Rank posiciona sua empresa no topo das pesquisas.",
        slug: "ia-muda-regras-da-busca-do-google-e-transforma-o-seo-como-as-empresas-podem-ser-",
        primaryKeyword: "IA muda regras da busca do Google",
        secondaryKeywords: [
          "SEO",
          "Google AI",
          "Growth Marketing",
          "Prime Rank Marketing"
        ],
        readingTimeMinutes: 8,
        wordCount: 1650
      },
      category: "Marketing Digital & SEO",
      tags: [
        "SEO",
        "Google Trends",
        "Inteligência Artificial",
        "Growth",
        "Prime Rank"
      ],
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
      subtitle: "Como transformar a tendência de \"Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\" em crescimento real, autoridade no Google e conversões previsíveis para o seu negócio.",
      slug: "como-dominar-a-1-pagina-do-google-na-regiao-metropolitana-do-recife-como-empresa",
      contentMarkdown: "\n# Como Dominar a 1ª Página do Google na Região Metropolitana do Recife: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google\n\nO mercado digital brasileiro evolui em velocidade recorde. Diariamente, novas tecnologias, inteligência artificial e atualizações nos algoritmos dos mecanismos de busca criam novos comportamentos de consumo e novos padrões de tomada de decisão. Recentemente, a pauta **\"Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\"** alcançou destaque expressivo nas buscas do Google, chamando a atenção de gestores, empresários e líderes de mercado.\n\nPara empresas que atuam de forma amadora, uma tendência em alta é encarada apenas como uma novidade passageira. No entanto, na metodologia de **Growth e Performance da Prime Rank Marketing**, cada movimento de alta demanda representa uma oportunidade de ouro para **capturar tráfego altamente qualificado, construir autoridade inquestionável no seu segmento e gerar um fluxo previsível de vendas diárias**.\n\nNeste guia completo e aprofundado, você vai entender os bastidores dessa tendência, o impacto direto no comportamento de compra do seu público e o passo a passo prático para transformar essa atenção do mercado em contratos assinados e faturamento real para o seu negócio.\n\n---\n\n## 1. O Cenário Atual: O Que Está Acontecendo e os Dados de Mercado\n\nOs radares de inteligência de busca e análise de tendências apontam que o crescimento expressivo no interesse por **\"Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\"** não é um evento isolado, mas o reflexo de uma demanda latente por soluções mais rápidas, eficientes e integradas no ambiente empresarial.\n\nNo ecossistema digital contemporâneo, mais de **93% das experiências online começam em um mecanismo de busca como o Google**. Quando um assunto ganha tração, milhares de potenciais clientes passam a pesquisar ativamente por informações, comparativos, prestadores de serviço e produtos relacionados.\n\n---\n\n## Conclusão: Dê o Próximo Passo Estratégico com a Prime Rank\n\nSe você deseja posicionar a sua empresa no topo das pesquisas, reduzir seu custo por cliente e acelerar suas vendas com segurança, fale agora mesmo com os especialistas da **Prime Rank Marketing**.\n\n> 🚀 [**Solicitar Diagnóstico Estratégico Gratuito no WhatsApp**](https://api.whatsapp.com/send?phone=5581986703728&text=Ol%C3%A1%21+Vim+pelo+Blog+da+Prime+Rank+e+gostaria+de+um+diagn%C3%B3stico+estrat%C3%A9gico+gratuito.)\n",
      excerpt: "A alta recente de buscas por \"Como Dominar a 1ª Página do Google na Região Metropolitana do Recife\" revela uma oportunidade para marcas que desejam se posicionar no topo do Google e converter atenção em clientes reais. Veja o roteiro estratégico.",
      featuredImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&sig=comodominara1pginadogooglenaregiometropolitanadorecife",
      imageAlt: "Guia Estratégico sobre Como Dominar a 1ª Página do Google na Região Metropolitana do Recife por Prime Rank Marketing",
      status: "published",
      trendSource: {
        topic: "Como Dominar a 1ª Página do Google na Região Metropolitana do Recife",
        discoveredAt: "2026-08-21T03:29:35.823Z",
        trafficSnippet: "Estratégias de SEO Local e tráfego qualificado para empresas de Pernambuco"
      },
      seo: {
        metaTitle: "Como Dominar a 1ª Página do Google na Região...",
        metaDescription: "Descubra o impacto de Como Dominar a 1ª Página do Google na Região Metropolitana do Recife no comportamento do consumidor e o método da Prime Rank Marketing...",
        slug: "como-dominar-a-1-pagina-do-google-na-regiao-metropolitana-do-recife-como-empresa",
        primaryKeyword: "Como Dominar a 1ª Página do Google na Região Metropolitana do Recife",
        secondaryKeywords: [
          "SEO",
          "Tráfego Pago",
          "Marketing Digital",
          "Prime Rank Marketing",
          "Conversão"
        ],
        readingTimeMinutes: 11,
        wordCount: 2194,
        faqSchemaJson: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[]}",
        checklist: {
          titleLengthValid: true,
          metaTitleLengthValid: true,
          metaDescLengthValid: true,
          keywordDefined: true,
          wordCountValid: true,
          slugCustomized: true,
          excerptFilled: true,
          overallScore: 100
        }
      },
      category: "Marketing Digital & SEO",
      tags: [
        "SEO",
        "Google Trends",
        "Marketing Digital",
        "Growth",
        "Tráfego Pago",
        "Conversão"
      ],
      author: {
        name: "Equipe Editorial Prime Rank",
        role: "Estrategistas de SEO & Growth Marketing"
      },
      createdAt: "2026-08-21T03:29:35.825Z",
      updatedAt: "2026-08-21T03:29:35.825Z",
      publishedAt: "2026-08-21T03:29:35.827Z"
    }
  ],
  trendsHistory: [],
  systemSettings: {
    autoGenerate: true,
    telegramEnabled: true
  }
};

function getInitialDatabase(): StorageDatabase {
  return JSON.parse(JSON.stringify(INITIAL_DATABASE_RAW));
}

const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0226f71ac66dc';
const BUNDLED_DB_FILE = path.resolve(process.cwd(), 'data', 'blog_storage.json');
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'data');
const DB_FILE = process.env.VERCEL ? path.join(DATA_DIR, 'blog_storage.json') : BUNDLED_DB_FILE;

export class StorageService {
  private static instance: StorageService;
  private db: StorageDatabase;
  private isSyncing = false;

  private constructor() {
    this.ensureDataDirectory();
    this.db = this.loadDatabase();
    this.syncFromCloud();
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
      if (fs.existsSync(DB_FILE)) {
        try {
          const content = fs.readFileSync(DB_FILE, 'utf-8');
          const parsed = JSON.parse(content);
          if (!parsed || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
            fs.writeFileSync(DB_FILE, JSON.stringify(getInitialDatabase(), null, 2), 'utf-8');
          }
        } catch (_) {
          fs.writeFileSync(DB_FILE, JSON.stringify(getInitialDatabase(), null, 2), 'utf-8');
        }
      } else {
        fs.writeFileSync(DB_FILE, JSON.stringify(getInitialDatabase(), null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('Aviso ao inicializar diretório de dados:', err);
    }
  }

  private getBundledDbFilePath(): string {
    const cwdPath = path.resolve(process.cwd(), 'data', 'blog_storage.json');
    if (fs.existsSync(cwdPath)) return cwdPath;

    const altPath = path.join(process.cwd(), '..', 'data', 'blog_storage.json');
    if (fs.existsSync(altPath)) return altPath;

    return BUNDLED_DB_FILE;
  }

  private loadDatabase(): StorageDatabase {
    try {
      const initialDb = getInitialDatabase();
      const initialPosts = initialDb.posts || [];
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
      initialPosts.forEach((p) => {
        if (p && p.id) postMap.set(p.id, p);
      });
      filePosts.forEach((p) => {
        if (p && p.id) {
          if (postMap.has(p.id)) {
            const existing = postMap.get(p.id)!;
            const validStatus = (p.status && p.status.trim().length > 0) ? p.status : (existing.status || 'published');
            const validPublishedAt = p.publishedAt || existing.publishedAt || new Date().toISOString();
            postMap.set(p.id, {
              ...existing,
              ...p,
              status: validStatus as PostStatus,
              publishedAt: validPublishedAt,
            });
          } else if (p.title && (p.contentMarkdown || p.excerpt)) {
            postMap.set(p.id, p);
          }
        }
      });

      initialDb.posts = Array.from(postMap.values())
        .map((p) => ({
          ...p,
          status: (p.status && p.status.trim().length > 0 ? p.status : (p.publishedAt ? 'published' : 'pending_approval')) as PostStatus,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return initialDb;
    } catch (err) {
      console.error('Erro ao carregar banco de dados local. Usando padrão...', err);
      return getInitialDatabase();
    }
  }

  private async syncFromCloud() {
    return;
  }

  private saveLocalDatabase() {
    try {
      if (!this.db || !Array.isArray(this.db.posts) || this.db.posts.length === 0) {
        return;
      }
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
    this.db = this.loadDatabase();
    return this.db.posts
      .map((p) => ({
        ...p,
        status: (p.status || (p.publishedAt ? 'published' : 'pending_approval')) as PostStatus,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getPostsByStatus(status: PostStatus): BlogPost[] {
    return this.getAllPosts().filter((p) => p.status === status);
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
    if (!post) {
      await this.syncFromCloud();
      post = this.getPostById(id);
    }
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

    await this.saveDatabase();
    return post;
  }

  public async deletePost(id: string): Promise<boolean> {
    let post = this.getPostById(id);
    if (!post) {
      await this.syncFromCloud();
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
    return this.db.trendsHistory.slice(0, limit);
  }

  public saveTrends(trends: TrendTopic[]) {
    const existingIds = new Set(this.db.trendsHistory.map((t) => t.id));
    const newTrends = trends.filter((t) => !existingIds.has(t.id));
    this.db.trendsHistory = [...newTrends, ...this.db.trendsHistory].slice(0, 100);
    this.saveDatabase();
  }

  // --- System Settings ---

  public getSettings() {
    return this.db.systemSettings;
  }

  public updateSettings(settings: Partial<StorageDatabase['systemSettings']>) {
    this.db.systemSettings = { ...this.db.systemSettings, ...settings };
    this.saveDatabase();
  }
}
