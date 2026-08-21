import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';
import { INITIAL_DATABASE } from '../data/initialData.js';

const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0226f71ac66dc';
const BUNDLED_DB_FILE = path.resolve(process.cwd(), 'data', 'blog_storage.json');
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'data');
const DB_FILE = process.env.VERCEL ? path.join(DATA_DIR, 'blog_storage.json') : BUNDLED_DB_FILE;

const DEFAULT_DB: StorageDatabase = {
  posts: [],
  trendsHistory: [],
  systemSettings: {
    autoGenerate: true,
    telegramEnabled: true,
  },
};

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
      if (!fs.existsSync(DB_FILE)) {
        if (fs.existsSync(BUNDLED_DB_FILE)) {
          const initialData = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
          fs.writeFileSync(DB_FILE, initialData, 'utf-8');
        } else {
          fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
        }
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
      let basePosts: BlogPost[] = INITIAL_DATABASE.posts || [];
      let extraPosts: BlogPost[] = [];
      let baseDb: StorageDatabase = JSON.parse(JSON.stringify(INITIAL_DATABASE));

      const bundledPath = this.getBundledDbFilePath();
      if (fs.existsSync(bundledPath)) {
        try {
          const content = fs.readFileSync(bundledPath, 'utf-8');
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed.posts) && parsed.posts.length > 0) {
            basePosts = parsed.posts;
          }
        } catch (_) {}
      }

      if (fs.existsSync(DB_FILE) && DB_FILE !== bundledPath) {
        try {
          const content = fs.readFileSync(DB_FILE, 'utf-8');
          const tmpDb = JSON.parse(content);
          if (Array.isArray(tmpDb.posts)) {
            extraPosts = tmpDb.posts;
          }
        } catch (_) {}
      }

      const postMap = new Map<string, BlogPost>();
      basePosts.forEach((p) => {
        if (p && p.id) postMap.set(p.id, p);
      });
      extraPosts.forEach((p) => {
        if (p && p.id) postMap.set(p.id, p);
      });

      baseDb.posts = Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return baseDb;
    } catch (err) {
      console.error('Erro ao carregar banco de dados local. Usando padrão...', err);
      return DEFAULT_DB;
    }
  }

  private async syncFromCloud() {
    // Sincronização em nuvem desativada para proteger a integridade dos artigos reais do repositório
    return;
  }

  private saveLocalDatabase() {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
      if (process.env.VERCEL && fs.existsSync(BUNDLED_DB_FILE)) {
        try {
          fs.writeFileSync(BUNDLED_DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
        } catch (_) {}
      }
    } catch (err) {
      console.error('Erro ao salvar localmente:', err);
    }
  }

  private async saveDatabase() {
    this.saveLocalDatabase();
  }

  // --- Posts Methods ---

  public getAllPosts(): BlogPost[] {
    return this.db.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getPostsByStatus(status: PostStatus): BlogPost[] {
    return this.getAllPosts().filter((p) => p.status === status);
  }

  public getPostById(id: string): BlogPost | undefined {
    return this.db.posts.find((p) => p.id === id);
  }

  public async findPostById(id: string): Promise<BlogPost | undefined> {
    let post = this.getPostById(id);
    if (!post) {
      await this.syncFromCloud();
      post = this.getPostById(id);
    }
    return post;
  }

  public getPostBySlug(slug: string): BlogPost | undefined {
    return this.db.posts.find((p) => p.slug === slug);
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
