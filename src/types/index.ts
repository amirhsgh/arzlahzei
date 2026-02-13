export type Category = "currency" | "gold" | "coin" | "crypto";

export interface PriceItem {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: Category;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  changeAmount: number;
  high24h: number;
  low24h: number;
  updatedAt: string | Date;
}

export interface PriceHistoryItem {
  id: string;
  priceId: string;
  price: number;
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[];
  coverImage: string | null;
  isAiGenerated: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  publishedAt: string | Date | null;
  viewCount: number;
  status: "draft" | "published";
  createdAt: string | Date;
}

export interface AdItem {
  id: string;
  title: string;
  type: string;
  position: string;
  imageUrl: string | null;
  linkUrl: string | null;
  htmlCode: string | null;
  isActive: boolean;
  priority: number;
  deviceTarget: "all" | "mobile" | "desktop";
  pageTarget: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
