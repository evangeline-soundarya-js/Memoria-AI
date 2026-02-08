export type Platform = 'YouTube' | 'Instagram' | 'Reddit' | 'Web/Blogs' | 'Other';
export type PrimaryCategory = 'Learning' | 'Career' | 'Mental Health' | 'Fitness' | 'Tech' | 'Entertainment' | 'Others' | string;
export type Theme = 'light' | 'dark';
export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';
export type SummaryDetail = 'concise' | 'detailed';

export interface ContentItem {
  id: string;
  input: string;
  title: string;
  platform: Platform;
  category: PrimaryCategory;
  subcategory: string;
  aiInsight: string;
  keyPoints: string[];
  isFavorite: boolean;
  isArchived: boolean;
  watched: boolean;
  timestamp: number;
}

export interface AIResponse {
  title: string;
  platform: Platform;
  category: PrimaryCategory;
  subcategory: string;
  aiInsight: string;
  keyPoints: string[];
}

export type View = 'home' | 'category' | 'subcategory' | 'platform' | 'favorites' | 'archived' | 'settings' | 'unwatched';