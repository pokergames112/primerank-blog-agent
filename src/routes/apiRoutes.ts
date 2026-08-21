import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService.js';
import { TrendsService } from '../services/trendsService.js';
import { AiWriterService } from '../services/aiWriterService.js';
import { SchedulerJob } from '../jobs/scheduler.js';
import { TelegramService } from '../services/telegramService.js';

export const apiRouter = Router();
const storage = StorageService.getInstance();
const trendsService = TrendsService.getInstance();
const aiWriter = AiWriterService.getInstance();
const scheduler = SchedulerJob.getInstance();
const telegram = TelegramService.getInstance();

// ==========================================
// 0. AUTENTICAÇÃO DO PAINEL MOBILE
// ==========================================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const configuredPassword = process.env.ADMIN_PASSWORD || 'primerank2026';

  if (!password || password.trim() !== configuredPassword.trim()) {
    return res.status(401).json({ success: false, error: 'Senha incorreta.' });
  }

  // Token simples para sessão segura no celular
  const token = Buffer.from(`auth_${configuredPassword}_${Date.now()}`).toString('base64');
  res.json({ success: true, token, message: 'Autenticado com sucesso!' });
});

// Middleware de verificação para rotas administrativas (gerar, aprovar, deletar)
const checkAdminAuth = (req: Request, res: Response, next: Function) => {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'primerank2026';
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Se não tem header, mas enviou senha direta
  const directPass = req.headers['x-admin-key'] || req.query.key;
  if (directPass === configuredPassword) {
    return next();
  }

  return res.status(401).json({ success: false, error: 'Acesso restrito. Faça login com sua senha.' });
};

// ==========================================
// 1. ENDPOINTS DE TENDÊNCIAS E GERAÇÃO
// ==========================================

// Lista tendências recentes do Google Trends
apiRouter.get('/trends', async (_req: Request, res: Response) => {
  try {
    const trends = await trendsService.fetchTrendingTopics();
    res.json({ success: true, count: trends.length, trends });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dispara geração autônoma de um post
apiRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topicTitle, customInstructions } = req.body;
    console.log(`[API] Requisição para gerar artigo. Tópico: ${topicTitle || 'Automático (Top Trend)'}`);

    let post;
    if (topicTitle) {
      const trend = {
        id: `topic_${Date.now()}`,
        title: topicTitle,
        category: 'Solicitação Manual',
        discoveredAt: new Date().toISOString(),
        relevanceScore: 99,
      };
      post = await aiWriter.generateArticleFromTrend(trend, customInstructions);
      storage.savePost(post);
      await telegram.notifyNewDraft(post);
    } else {
      post = await scheduler.runTrendDiscoveryAndDrafting();
    }

    res.json({ success: true, message: 'Artigo gerado com sucesso!', post });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. ENDPOINTS DO PAINEL / VALIDAÇÃO MOBILE
// ==========================================

// Listar todos os posts (com filtro por status)
apiRouter.get('/posts', (req: Request, res: Response) => {
  const { status } = req.query;
  let posts = storage.getAllPosts();

  if (status && typeof status === 'string') {
    posts = posts.filter((p) => p.status === status);
  }

  res.json({ success: true, count: posts.length, posts });
});

// Obter post por ID
apiRouter.get('/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = storage.getPostById(id);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post não encontrado' });
  }

  res.json({ success: true, post });
});

// Atualizar status (Validação Mobile: Aprovar / Rejeitar / Publicar)
apiRouter.patch('/posts/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!['draft', 'pending_approval', 'approved', 'published', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Status inválido' });
  }

  const updated = storage.updatePostStatus(id, status, notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Post não encontrado' });
  }

  console.log(`[API] Post ${id} teve seu status atualizado para: "${status}"`);
  res.json({ success: true, message: `Status alterado para ${status}`, post: updated });
});

// Atualizar conteúdo e dados do post
apiRouter.put('/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = storage.getPostById(id);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post não encontrado' });
  }

  const updatedPost = { ...post, ...req.body, id, updatedAt: new Date().toISOString() };
  storage.savePost(updatedPost);

  res.json({ success: true, message: 'Post atualizado com sucesso', post: updatedPost });
});

// Excluir post
apiRouter.delete('/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = storage.deletePost(id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Post não encontrado' });
  }

  res.json({ success: true, message: 'Post excluído' });
});

// Estatísticas do Painel
apiRouter.get('/stats', (_req: Request, res: Response) => {
  const allPosts = storage.getAllPosts();
  const published = allPosts.filter((p) => p.status === 'published');
  const pending = allPosts.filter((p) => p.status === 'pending_approval');
  const rejected = allPosts.filter((p) => p.status === 'rejected');
  const totalWords = published.reduce((acc, p) => acc + (p.seo?.wordCount || 0), 0);

  res.json({
    success: true,
    stats: {
      total: allPosts.length,
      published: published.length,
      pendingApproval: pending.length,
      rejected: rejected.length,
      totalWordsPublished: totalWords,
      averageWordsPerPost: published.length > 0 ? Math.round(totalWords / published.length) : 0,
    },
  });
});

// ==========================================
// 3. API PÚBLICA PARA O SITE (primerankmarketing.com.br)
// ==========================================

// Lista posts públicos para a aba de blog do site
apiRouter.get('/blog/posts', (req: Request, res: Response) => {
  const { page = '1', limit = '10', tag, category } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;

  let publishedPosts = storage.getPostsByStatus('published');

  if (category && typeof category === 'string') {
    publishedPosts = publishedPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (tag && typeof tag === 'string') {
    publishedPosts = publishedPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  const total = publishedPosts.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = publishedPosts.slice(startIndex, startIndex + limitNum).map((post) => ({
    id: post.id,
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    category: post.category,
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt || post.createdAt,
    readingTimeMinutes: post.seo.readingTimeMinutes,
    wordCount: post.seo.wordCount,
  }));

  res.json({
    success: true,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    posts: paginated,
  });
});

// Obter post completo por Slug (para renderizar a página do post no site)
apiRouter.get('/blog/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = storage.getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    return res.status(404).json({ success: false, error: 'Artigo não encontrado ou ainda não publicado.' });
  }

  res.json({
    success: true,
    post: {
      ...post,
      canonicalUrl: `https://primerankmarketing.com.br/blog/${post.slug}`,
    },
  });
});
