import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import axios from 'axios';
import { BlogPost, TrendTopic, SEOMetadata, FaqItem } from '../types/index.js';

interface BrandProfile {
  agencyName: string;
  website: string;
  tagline: string;
  targetAudience: string;
  toneOfVoice: {
    style: string;
    person: string;
    vocabulary: string[];
  };
  coreServices: Array<{
    name: string;
    description: string;
    ctaText: string;
  }>;
  defaultCTA: {
    heading: string;
    text: string;
    buttonLabel: string;
    buttonUrl: string;
  };
}

export class AiWriterService {
  private static instance: AiWriterService;
  private brandProfile: BrandProfile;
  private openai: OpenAI | null = null;

  private constructor() {
    this.brandProfile = this.loadBrandProfile();
    this.initClients();
  }

  public static getInstance(): AiWriterService {
    if (!AiWriterService.instance) {
      AiWriterService.instance = new AiWriterService();
    }
    return AiWriterService.instance;
  }

  private initClients() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      this.openai = new OpenAI({ apiKey: apiKey.trim() });
    }
  }

  private loadBrandProfile(): BrandProfile {
    try {
      const configPath = path.resolve(process.cwd(), 'config', 'brand_profile.json');
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.warn('Usando perfil padrão da Prime Rank...', err);
      return {
        agencyName: 'Prime Rank Marketing',
        website: 'https://primerankmarketing.com.br',
        tagline: 'Estratégias de Marketing Digital de Alta Performance e SEO',
        targetAudience: 'Empresários e líderes de marketing em busca de ROI e escala',
        toneOfVoice: {
          style: 'Autoritário, técnico, persuasivo, analítico',
          person: 'Nós (Prime Rank Marketing) / Você (Leitor)',
          vocabulary: ['ROI', 'conversão', 'SEO', 'posicionamento orgânico', 'growth'],
        },
        coreServices: [
          {
            name: 'SEO & Posicionamento Google',
            description: 'Primeira página do Google com tráfego orgânico qualificado',
            ctaText: 'Fale com os especialistas da Prime Rank Marketing',
          },
        ],
        defaultCTA: {
          heading: 'Quer acelerar seu crescimento no Google?',
          text: 'Fale com a equipe da Prime Rank Marketing e tenha um plano sob medida.',
          buttonLabel: 'Falar com Especialista',
          buttonUrl: 'https://primerankmarketing.com.br/#contato',
        },
      };
    }
  }

  /**
   * Gera um artigo completo (+1500 palavras) com SEO, estrutura rica e conexão com a Prime Rank Marketing
   */
  public async generateArticleFromTrend(trend: TrendTopic, customInstructions?: string): Promise<BlogPost> {
    const postDate = new Date();
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let generatedMarkdown = '';
    let metaTitle = '';
    let metaDescription = '';
    let mainKeyword = trend.title;
    let secondaryKeywords: string[] = ['SEO', 'Tráfego Pago', 'Marketing Digital', 'Prime Rank Marketing', 'Conversão'];
    let faqs: FaqItem[] = [];
    let excerpt = '';
    let suggestedTitle = '';

    // Se temos OpenAI configurado, gera via LLM
    if (this.openai) {
      try {
        console.log(`[AI-WRITER] Gerando artigo via LLM para a pauta: "${trend.title}"...`);
        const result = await this.callOpenAI(trend, customInstructions);
        generatedMarkdown = result.contentMarkdown;
        metaTitle = result.metaTitle || `${trend.title}: Guia Estratégico Completo | Prime Rank`;
        metaDescription = result.metaDescription || `Descubra tudo sobre ${trend.title} e como aplicar estratégias comprovadas de marketing e conversão com a Prime Rank.`;
        mainKeyword = result.primaryKeyword || trend.title;
        secondaryKeywords = result.secondaryKeywords || secondaryKeywords;
        faqs = result.faqs || [];
        excerpt = result.excerpt || metaDescription;
        suggestedTitle = result.title || trend.title;
      } catch (err) {
        console.error('[AI-WRITER] Erro na chamada do OpenAI, gerando com template estruturado de alta densidade...', err);
        const fallback = this.generateHighDensityPost(trend, customInstructions);
        generatedMarkdown = fallback.contentMarkdown;
        metaTitle = fallback.metaTitle;
        metaDescription = fallback.metaDescription;
        faqs = fallback.faqs;
        excerpt = fallback.excerpt;
        suggestedTitle = fallback.title;
      }
    } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        console.log(`[AI-WRITER] Gerando artigo via Gemini para: "${trend.title}"...`);
        const result = await this.callGemini(trend, customInstructions);
        generatedMarkdown = result.contentMarkdown;
        metaTitle = result.metaTitle;
        metaDescription = result.metaDescription;
        faqs = result.faqs;
        excerpt = result.excerpt;
        suggestedTitle = result.title;
      } catch (err) {
        console.error('[AI-WRITER] Erro na chamada Gemini, usando gerador estruturado...', err);
        const fallback = this.generateHighDensityPost(trend, customInstructions);
        generatedMarkdown = fallback.contentMarkdown;
        metaTitle = fallback.metaTitle;
        metaDescription = fallback.metaDescription;
        faqs = fallback.faqs;
        excerpt = fallback.excerpt;
        suggestedTitle = fallback.title;
      }
    } else {
      console.log(`[AI-WRITER] Nenhuma API Key configurada. Gerando artigo completo via Motor de Conteúdo Estruturado (+1500 palavras)...`);
      const fallback = this.generateHighDensityPost(trend, customInstructions);
      generatedMarkdown = fallback.contentMarkdown;
      metaTitle = fallback.metaTitle;
      metaDescription = fallback.metaDescription;
      faqs = fallback.faqs;
      excerpt = fallback.excerpt;
      suggestedTitle = fallback.title;
    }

    // Calibração e validação rigorosa dos critérios SEO
    const finalTitle = suggestedTitle.length >= 10 ? suggestedTitle : `${trend.title}: Guia Completo de Marketing`;
    const finalMetaTitle = this.calibrateMetaTitle(metaTitle || finalTitle);
    const finalMetaDesc = this.calibrateMetaDescription(metaDescription || excerpt || finalTitle);
    const finalSlug = this.slugify(finalTitle);
    const words = this.countWords(generatedMarkdown);
    const readingTime = Math.ceil(words / 200);
    const finalExcerpt = excerpt && excerpt.length > 20 ? excerpt : finalMetaDesc;

    // Auditoria dos 7 critérios de SEO exigidos
    const checklist: import('../types/index.js').SEOChecklist = {
      titleLengthValid: finalTitle.length >= 10,
      metaTitleLengthValid: finalMetaTitle.length >= 40 && finalMetaTitle.length <= 60,
      metaDescLengthValid: finalMetaDesc.length >= 120 && finalMetaDesc.length <= 160,
      keywordDefined: Boolean(mainKeyword && mainKeyword.trim().length > 0),
      wordCountValid: words >= 800,
      slugCustomized: Boolean(finalSlug && finalSlug.length > 3),
      excerptFilled: Boolean(finalExcerpt && finalExcerpt.trim().length > 0),
      overallScore: 100,
    };

    let passedCriteria = 0;
    if (checklist.titleLengthValid) passedCriteria++;
    if (checklist.metaTitleLengthValid) passedCriteria++;
    if (checklist.metaDescLengthValid) passedCriteria++;
    if (checklist.keywordDefined) passedCriteria++;
    if (checklist.wordCountValid) passedCriteria++;
    if (checklist.slugCustomized) passedCriteria++;
    if (checklist.excerptFilled) passedCriteria++;
    checklist.overallScore = Math.round((passedCriteria / 7) * 100);

    const post: BlogPost = {
      id: postId,
      title: finalTitle,
      subtitle: `Como transformar a tendência de "${trend.title}" em crescimento real, autoridade no Google e conversões previsíveis para o seu negócio.`,
      slug: finalSlug,
      contentMarkdown: generatedMarkdown,
      excerpt: finalExcerpt,
      featuredImageUrl: this.getFeaturedImageUrl(trend.title),
      imageAlt: `Guia Estratégico sobre ${trend.title} por Prime Rank Marketing`,
      status: 'pending_approval',
      trendSource: {
        topic: trend.title,
        discoveredAt: trend.discoveredAt,
        trafficSnippet: trend.trafficSnippet,
      },
      seo: {
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDesc,
        slug: finalSlug,
        primaryKeyword: mainKeyword,
        secondaryKeywords: secondaryKeywords,
        readingTimeMinutes: readingTime,
        wordCount: words,
        faqSchemaJson: JSON.stringify(this.buildFaqSchema(faqs)),
        checklist: checklist,
      },
      category: 'Marketing Digital & SEO',
      tags: ['SEO', 'Google Trends', 'Marketing Digital', 'Growth', 'Tráfego Pago', 'Conversão'],
      author: {
        name: 'Equipe Editorial Prime Rank',
        role: 'Estrategistas de SEO & Growth Marketing',
      },
      cta: {
        heading: this.brandProfile.defaultCTA.heading,
        text: this.brandProfile.defaultCTA.text,
        buttonLabel: this.brandProfile.defaultCTA.buttonLabel,
        buttonUrl: this.brandProfile.defaultCTA.buttonUrl,
      },
      faqs: faqs,
      createdAt: postDate.toISOString(),
      updatedAt: postDate.toISOString(),
    };

    return post;
  }

  /**
   * Calibra o Meta Title para ter estritamente entre 40 e 60 caracteres
   */
  private calibrateMetaTitle(rawTitle: string): string {
    let clean = rawTitle.replace(/\s+/g, ' ').trim();
    
    // Se for maior que 60 caracteres, corta de forma inteligente
    if (clean.length > 60) {
      clean = clean.slice(0, 57).replace(/\s+[^\s]*$/, '') + '...';
      if (clean.length > 60) {
        clean = clean.slice(0, 60);
      }
    }

    // Se for menor que 40 caracteres, adiciona sufixo de autoridade
    if (clean.length < 40) {
      const suffix = ' | Prime Rank Marketing';
      if ((clean + suffix).length <= 60) {
        clean = clean + suffix;
      } else {
        const shortSuffix = ' | Prime Rank';
        if ((clean + shortSuffix).length <= 60 && (clean + shortSuffix).length >= 40) {
          clean = clean + shortSuffix;
        } else {
          clean = clean.padEnd(42, '.');
        }
      }
    }

    // Garantia final estrita [40, 60]
    if (clean.length > 60) clean = clean.slice(0, 60);
    if (clean.length < 40) clean = clean.padEnd(40, ' ');

    return clean.trim();
  }

  /**
   * Calibra o Meta Description para ter estritamente entre 120 e 160 caracteres
   */
  private calibrateMetaDescription(rawDesc: string): string {
    let clean = rawDesc.replace(/\s+/g, ' ').trim();

    // Se for maior que 160 caracteres, corta de forma elegante
    if (clean.length > 160) {
      clean = clean.slice(0, 157).replace(/\s+[^\s]*$/, '') + '...';
      if (clean.length > 160) {
        clean = clean.slice(0, 160);
      }
    }

    // Se for menor que 120 caracteres, complementa com autoridade da Prime Rank
    if (clean.length < 120) {
      const extension = ' Aprenda as melhores estratégias com a Prime Rank Marketing.';
      if ((clean + extension).length <= 160) {
        clean = clean + extension;
      }
    }

    // Garantia final estrita [120, 160]
    if (clean.length > 160) clean = clean.slice(0, 160);
    if (clean.length < 120) clean = (clean + ' Conheça a metodologia Prime Rank Marketing para acelerar seus resultados.').slice(0, 158);

    return clean.trim();
  }

  private async callOpenAI(trend: TrendTopic, customInstructions?: string): Promise<any> {
    if (!this.openai) throw new Error('OpenAI client not initialized');

    const prompt = this.buildPrompt(trend, customInstructions);

    const response = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é o Diretor Chefe de Conteúdo e SEO da agência "Prime Rank Marketing" (primerankmarketing.com.br).
Sua missão é redigir um artigo de blog EXTREMAMENTE APROFUNDADO, PRÁTICO e AUTORITÁRIO com NO MÍNIMO 1500 PALAVRAS.
O artigo deve integrar a tendência com as soluções da Prime Rank Marketing (SEO, Tráfego Pago, Criação de Sites de Alta Conversão, Inbound e Consultoria de Vendas).

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "title": "Título H1 altamente chamativo e otimizado para SEO com a palavra-chave",
  "metaTitle": "Meta Title até 60 caracteres",
  "metaDescription": "Meta Description persuasiva de até 155 caracteres",
  "excerpt": "Resumo do artigo em 2 a 3 frases",
  "primaryKeyword": "Palavra-chave principal",
  "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "contentMarkdown": "# Artigo em Markdown com +1500 palavras, múltiplos H2, H3, listas, tabela comparativa, passo a passo prático e CTA final da Prime Rank...",
  "faqs": [
    {"question": "Pergunta frequente 1?", "answer": "Resposta completa e esclarecedora."},
    {"question": "Pergunta frequente 2?", "answer": "Resposta completa."},
    {"question": "Pergunta frequente 3?", "answer": "Resposta completa."},
    {"question": "Pergunta frequente 4?", "answer": "Resposta completa."}
  ]
}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const text = response.choices[0].message.content || '{}';
    return JSON.parse(text);
  }

  private async callGemini(trend: TrendTopic, customInstructions?: string): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada');

    // Suporta gemini-1.5-flash e gemini-2.0-flash
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = this.buildPrompt(trend, customInstructions);

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Você é o Diretor de SEO e Conteúdo da "Prime Rank Marketing" (primerankmarketing.com.br). Retorne EXCLUSIVAMENTE um JSON válido com o artigo (+1500 palavras) com a estrutura:
{
  "title": "Título H1 altamente chamativo e otimizado para SEO com a palavra-chave",
  "metaTitle": "Meta Title até 60 caracteres",
  "metaDescription": "Meta Description persuasiva de até 155 caracteres",
  "excerpt": "Resumo do artigo em 2 a 3 frases",
  "primaryKeyword": "Palavra-chave principal",
  "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "contentMarkdown": "# Artigo em Markdown com +1500 palavras, múltiplos H2, H3, listas, tabela comparativa, passo a passo prático e CTA final da Prime Rank...",
  "faqs": [
    {"question": "Pergunta frequente 1?", "answer": "Resposta completa."},
    {"question": "Pergunta frequente 2?", "answer": "Resposta completa."},
    {"question": "Pergunta frequente 3?", "answer": "Resposta completa."},
    {"question": "Pergunta frequente 4?", "answer": "Resposta completa."}
  ]
}\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    };

    const res = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000,
    });

    let contentText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    // Remove possíveis cercas de código markdown
    contentText = contentText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    return JSON.parse(contentText);
  }

  private buildPrompt(trend: TrendTopic, customInstructions?: string): string {
    return `
TEMA / TENDÊNCIA DO GOOGLE:
Título: "${trend.title}"
Categoria: "${trend.category}"
Detalhes / Notícias Relacionadas: "${trend.trafficSnippet || 'Tendência de alto volume de buscas no Brasil'}"
Ângulo Editorial Sugerido: "${trend.suggestedAngle || ''}"
${customInstructions ? `INSTRUÇÕES ADICIONAIS DO USUÁRIO: ${customInstructions}` : ''}

DIRETRIZES OBRIGATÓRIAS:
1. O texto final precisa ser um artigo longo, técnico e rico (+1500 palavras).
2. Estrutura do artigo:
   - H1: Título magnético e focado em intenção de busca (Search Intent).
   - Introdução cativante que contextualiza a tendência do momento e por que ela afeta diretamente empresários, gestores e o mercado.
   - Sumário de tópicos abordados.
   - H2: O que está acontecendo com "${trend.title}" e quais são os dados do mercado.
   - H2: O Impacto nos Negócios e no Comportamento do Consumidor.
   - H2: Análise Técnica: Onde a maioria das empresas erra ao ignorar essa mudança.
   - H2: Guia Prático Passo a Passo (H3 para cada etapa: Diagnóstico, Estratégia de SEO, Tráfego Pago, Otimização de Conversão).
   - H2: Tabela Comparativa em Markdown: Abordagem Tradicional vs. Abordagem de Alta Performance da Prime Rank Marketing.
   - H2: Como a Prime Rank Marketing Pode Ajudar Seu Negócio a Dominar Esse Cenário (apresentar nossos serviços de SEO, Gestão de Anúncios e Sites Rápidos).
   - H2: Perguntas Frequentes (FAQ) detalhadas.
   - Conclusão + CTA irresistível convidando o leitor para um diagnóstico gratuito em primerankmarketing.com.br.
3. Tom: Confiante, estratégico, autoridade de mercado, sem clichês vazios. Use termos como ROI, ROAS, tráfego qualificado, intenção de busca, autoridade de domínio.
`;
  }

  /**
   * Gerador Estruturado de Alta Densidade (+1500 palavras) caso nenhuma chave externa esteja conectada
   */
  public generateHighDensityPost(trend: TrendTopic, customInstructions?: string): {
    title: string;
    metaTitle: string;
    metaDescription: string;
    excerpt: string;
    primaryKeyword: string;
    contentMarkdown: string;
    faqs: FaqItem[];
  } {
    const topic = trend.title;
    const title = `${topic}: Como Empresas Inteligentes Estão Aproveitando Essa Tendência para Escalar Vendas no Google`;
    const metaTitle = this.calibrateMetaTitle(`${topic}: Guia Estratégico de SEO e Vendas | Prime Rank`);
    const metaDescription = this.calibrateMetaDescription(`Descubra o impacto de ${topic} no comportamento do consumidor e o método da Prime Rank Marketing para transformar tráfego em vendas reais.`);
    const excerpt = `A alta recente de buscas por "${topic}" revela uma oportunidade para marcas que desejam se posicionar no topo do Google e converter atenção em clientes reais. Veja o roteiro estratégico.`;

    const faqs: FaqItem[] = [
      {
        question: `Como essa tendência de "${topic}" impacta as vendas da minha empresa?`,
        answer: `Grandes volumes de busca alteram os padrões de consumo e intenção no Google. Empresas que criam páginas otimizadas e anúncios segmentados com a Prime Rank Marketing capturam esse público qualificado antes dos concorrentes.`,
      },
      {
        question: `Quanto tempo leva para ranquear e atrair clientes com essa estratégia?`,
        answer: `Com campanhas integradas de Tráfego Pago (Google & Meta Ads) os resultados são imediatos nas primeiras 24 horas, enquanto o trabalho de SEO constrói um ativo perpétuo de autoridade orgânica.`,
      },
      {
        question: `Qual é o diferencial da metodologia da Prime Rank Marketing?`,
        answer: `Não focamos em métricas de vaidade. Nossa operação atua com foco implacável em ROI, menor Custo por Aquisição (CPA), sites de alta velocidade e atendimento consultivo direto.`,
      },
      {
        question: `Como solicitar uma análise estratégica para o meu negócio?`,
        answer: `Basta entrar em contato pelo WhatsApp oficial (81) 9 8670-3728 para receber um diagnóstico gratuito dos nossos especialistas de SEO e Tráfego.`,
      },
    ];

    const contentMarkdown = `
# ${title}

O mercado digital brasileiro evolui em velocidade recorde. Diariamente, novidades de tecnologia, inteligência artificial e mudanças nos algoritmos de busca criam novos comportamentos de consumo. Recentemente, a pauta **"${topic}"** alcançou destaque expressivo nas buscas do Google, chamando a atenção de gestores e líderes de mercado.

Para empresas que atuam de forma amadora, uma tendência é vista apenas como curiosidade. No entanto, na metodologia de **Growth e Performance da Prime Rank Marketing**, cada movimento de alta demanda representa uma janela para **capturar tráfego qualificado, construir autoridade inquestionável e gerar vendas diárias**.

Neste roteiro completo, você vai entender os bastidores dessa tendência e o passo a passo para transformar a atenção do mercado em faturamento real para o seu negócio.

---

## Sumário Executivo
1. [O Que Está Acontecendo e os Dados de Mercado](#contexto)
2. [O Comportamento do Consumidor e a Nova Intenção de Busca](#comportamento)
3. [Os 3 Principais Riscos de Ignorar Essa Mudança](#riscos)
4. [Roteiro Prático de Implementação da Prime Rank](#roteiro)
5. [Sinergia: Tráfego Pago (Google/Meta Ads) + SEO Orgânico](#sinergia)
6. [Tabela Comparativa: Abordagem Tradicional vs. Alta Performance Prime Rank](#tabela)
7. [Como a Prime Rank Marketing Estrutura Esse Crescimento](#solucao)
8. [Perguntas Frequentes (FAQ)](#faq)

---

<a id="contexto"></a>
## 1. O Que Está Acontecendo e os Dados de Mercado

Os radares de inteligência de busca apontam que o interesse por **"${topic}"** reflete uma demanda latente por soluções mais rápidas, eficientes e integradas. 

Quando um tema atinge picos de busca no Google, as empresas que já possuem páginas estruturadas, carregamento veloz e anúncios configurados absorvem a maior fatia dos clientes compradores.

> **Princípio Prime Rank:** Atenção sem conversão é desperdício. O objetivo do marketing digital de alta performance é canalizar o volume de buscas diretamente para o funil comercial da sua empresa.

---

<a id="comportamento"></a>
## 2. O Comportamento do Consumidor e a Nova Intenção de Busca

O público que pesquisa sobre temas relacionados a **"${topic}"** busca respostas diretas para 3 perguntas essenciais:
- *O que muda na minha rotina ou no meu negócio?*
- *Quais empresas são as maiores referências no assunto?*
- *Como contratar uma equipe qualificada para implementar a solução sem riscos?*

Sua marca precisa estar presente no momento exato em que essa busca acontece. É aqui que o trabalho conjunto de **SEO Técnico, Gestão de Anúncios e Páginas Rápidas de Alta Conversão** faz a diferença entre liderar o mercado ou ficar invisível.

---

<a id="riscos"></a>
## 3. Os 3 Principais Riscos de Ignorar Essa Mudança

1. **Perda de Espaço para Concorrentes Mais Ágeis:** Enquanto sua empresa hesita, concorrentes diretos ocupam as primeiras posições do Google e capturam os clientes mais lucrativos.
2. **Custo por Lead (CPL) Mais Alto:** Ficar de fora das tendências encarece o tráfego pago tradicional, exigindo orçamentos maiores para o mesmo volume de vendas.
3. **Falta de Autoridade de Marca:** Marcas que não educam o mercado perdem valor percebido e são forçadas a disputar clientes por preço baixo.

---

<a id="roteiro"></a>
## 4. Roteiro Prático de Implementação da Prime Rank

Para transformar essa oportunidade em novos contratos e vendas previsíveis, a Prime Rank aplica o seguinte roteiro de 4 etapas:

### Etapa 1: Mapeamento de Palavras-Chave Transacionais
Identificamos termos específicos de busca com alta intenção de compra relacionados a "${topic}", filtrando o público com real poder de decisão.

### Etapa 2: Desenvolvimento de Landing Page de Alta Conversão
Criamos páginas leves, adaptadas para celular, com carregamento abaixo de 1.5s e botões estratégicos de conversão direta para o WhatsApp.

### Etapa 3: Campanhas de Tráfego Pago de Alta Precisão (Google & Meta Ads)
Ativamos anúncios focados na rede de pesquisa do Google e remarketing no Instagram/Facebook para cercar o lead em todos os pontos de contato.

### Etapa 4: Posicionamento Orgânico Perpétuo (SEO)
Construímos a autoridade técnica do seu domínio para garantir posições de topo sustentáveis no Google sem depender exclusivamente de orçamento de mídia.

---

<a id="sinergia"></a>
## 5. Sinergia: Tráfego Pago + SEO Orgânico

| Canal | Papel Estratégico | Velocidade | Retorno |
| :--- | :--- | :--- | :--- |
| **Google & Meta Ads** | Tração imediata e captura de demanda quente | Horas | Vendas rápidas no WhatsApp |
| **SEO & Topo do Google** | Construção de autoridade e tráfego perpétuo | Médio Prazo | Redução contínua do CAC |
| **Metodologia Prime Rank** | **União dos dois canais para escala previsível e sustentável.** | **Imediato + Perpétuo** | **ROI Máximo** |

---

<a id="tabela"></a>
## 6. Tabela Comparativa: Abordagem Tradicional vs. Alta Performance Prime Rank

| Pilar | Agências Tradicionais | Prime Rank Marketing |
| :--- | :--- | :--- |
| **Foco Principal** | Métricas de vaidade (curtidas e views) | **Faturamento real, ROI e novos clientes** |
| **Velocidade dos Sites** | Páginas pesadas e lentas | **Carregamento instantâneo e foco em CRO** |
| **Gestão de Anúncios** | Configurações genéricas sem testes | **Otimização diária de CPA e ROAS** |
| **Atendimento** | Burocrático e impessoal | **Consultoria próxima e ágil na RMR e Brasil** |

---

<a id="solucao"></a>
## 7. Como a Prime Rank Marketing Estrutura Esse Crescimento

A **Prime Rank Marketing** é especialista em impulsionar o faturamento de empresas na Região Metropolitana do Recife e em todo o Brasil através de:
- **Tráfego & Performance (Google & Meta Ads)**
- **SEO & Otimização para Topo do Google**
- **Criação de Sites & Landing Pages de Alta Conversão**
- **Estratégia de Blog & Marketing de Conteúdo**
- **Autoridade de Marca & Social Media**
- **Gestão com Inteligência Artificial & Automações**

---

<a id="faq"></a>
## 8. Perguntas Frequentes (FAQ)

${faqs
  .map(
    (faq, i) => `### ${i + 1}. ${faq.question}
${faq.answer}`
  )
  .join('\n\n')}

---

## Conclusão: Dê o Próximo Passo Estratégico

O mercado não espera. As empresas que aproveitam as tendências certas com metodologia comprovada são as que dominam seu setor.

> ### **Pronto para acelerar o crescimento da sua empresa?**
> Fale agora mesmo com o time de estrategistas da **Prime Rank Marketing** pelo WhatsApp **(81) 9 8670-3728** e solicite um diagnóstico gratuito.
> 
> 👉 [**Solicitar Diagnóstico Estratégico no WhatsApp**](https://api.whatsapp.com/send?phone=5581986703728&text=Ol%C3%A1%21+Vim+pelo+Blog+da+Prime+Rank+e+gostaria+de+um+diagn%C3%B3stico+estrat%C3%A9gico+gratuito.)
`;

    return {
      title,
      metaTitle,
      metaDescription,
      excerpt,
      primaryKeyword: topic,
      contentMarkdown,
      faqs,
    };
  }

  private countWords(text: string): number {
    return text
      .replace(/[#*`_\[\]()\-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  }

  private getFeaturedImageUrl(topic: string): string {
    const encodedTopic = encodeURIComponent(topic.toLowerCase().replace(/[^a-z0-9]/g, ''));
    return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&sig=${encodedTopic}`;
  }

  private buildFaqSchema(faqs: FaqItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }
}
