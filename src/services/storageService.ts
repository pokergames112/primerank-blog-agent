import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';

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

  private loadDatabase(): StorageDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
      if (fs.existsSync(BUNDLED_DB_FILE)) {
        const content = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
      return DEFAULT_DB;
    } catch (err) {
      console.error('Erro ao carregar banco de dados local. Usando padrão...', err);
      return DEFAULT_DB;
    }
  }

  private async syncFromCloud() {
    try {
      const res = await axios.get(CLOUD_STORE_URL, { timeout: 4000 });
      if (res.data && res.data.data && Array.isArray(res.data.data.posts)) {
        const cloudPosts: BlogPost[] = res.data.data.posts;
        if (cloudPosts.length > 0) {
          const postMap = new Map<string, BlogPost>();
          this.db.posts.forEach((p) => postMap.set(p.id, p));
          cloudPosts.forEach((p) => postMap.set(p.id, p));
          this.db.posts = Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.saveLocalDatabase();
          console.log('[STORAGE] Sincronizado com a nuvem com sucesso. Total posts:', this.db.posts.length);
        }
      }
    } catch (err) {
      console.warn('[STORAGE] Usando banco de dados local/bundle (nuvem offline ou timeout)');
    }
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

    // Sincroniza em background com o armazenamento em nuvem persistente
    try {
      await axios.put(
        CLOUD_STORE_URL,
        {
          name: 'primerank_blog_storage',
          data: {
            posts: this.db.posts,
            updatedAt: new Date().toISOString(),
          },
        },
        { timeout: 5000 }
      );
      console.log('[STORAGE] Nuvem atualizada com sucesso!');
    } catch (err) {
      console.warn('[STORAGE] Erro ao sincronizar com a nuvem em background:', err);
    }
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

  public deletePost(id: string): boolean {
    const initialLen = this.db.posts.length;
    this.db.posts = this.db.posts.filter((p) => p.id !== id);
    const deleted = this.db.posts.length !== initialLen;
    if (deleted) {
      this.saveDatabase();
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
