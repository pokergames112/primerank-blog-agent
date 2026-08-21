export type PostStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';

export interface TrendTopic {
  id: string;
  title: string;
  trafficSnippet?: string;
  approximateTraffic?: string;
  newsSources?: { title: string; url: string; source: string }[];
  category: string;
  discoveredAt: string;
  relevanceScore?: number; // 0-100 relevance to marketing/business/growth
  suggestedAngle?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SEOChecklist {
  titleLengthValid: boolean;        // 10+ chars
  metaTitleLengthValid: boolean;    // 40-60 chars
  metaDescLengthValid: boolean;     // 120-160 chars
  keywordDefined: boolean;          // Palavra-chave definida
  wordCountValid: boolean;          // 800+ palavras
  slugCustomized: boolean;          // Slug personalizado
  excerptFilled: boolean;           // Resumo preenchido
  overallScore: number;             // 0-100%
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  readingTimeMinutes: number;
  wordCount: number;
  canonicalUrl?: string;
  faqSchemaJson?: string;
  checklist?: SEOChecklist;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  contentMarkdown: string;
  contentHtml?: string;
  excerpt: string;
  featuredImageUrl?: string;
  imageAlt?: string;
  status: PostStatus;
  trendSource?: {
    topic: string;
    discoveredAt: string;
    trafficSnippet?: string;
  };
  seo: SEOMetadata;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  cta: {
    heading: string;
    text: string;
    buttonLabel: string;
    buttonUrl: string;
  };
  faqs: FaqItem[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  publishedAt?: string;
  validationNotes?: string;
}

export interface StorageDatabase {
  posts: BlogPost[];
  trendsHistory: TrendTopic[];
  systemSettings: {
    autoGenerate: boolean;
    telegramEnabled: boolean;
    lastCronRun?: string;
  };
}
