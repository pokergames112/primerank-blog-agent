import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';
import { getInitialDatabase } from '../data/initialData.js';

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
            postMap.set(p.id, { ...existing, ...p });
          } else if (p.title && (p.contentMarkdown || p.excerpt)) {
            postMap.set(p.id, p);
          }
        }
      });

      initialDb.posts = Array.from(postMap.values())
        .map((p) => ({
          ...p,
          status: (p.status || (p.publishedAt ? 'published' : 'pending_approval')) as PostStatus,
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
