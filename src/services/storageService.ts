import fs from 'fs';
import path from 'path';
import { BlogPost, StorageDatabase, TrendTopic, PostStatus } from '../types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'blog_storage.json');

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
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    }
  }

  private loadDatabase(): StorageDatabase {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Erro ao carregar banco de dados local. Recriando padrão...', err);
      return DEFAULT_DB;
    }
  }

  private saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar no banco de dados local:', err);
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

  public updatePostStatus(id: string, status: PostStatus, notes?: string): BlogPost | null {
    const post = this.getPostById(id);
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

    this.saveDatabase();
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
