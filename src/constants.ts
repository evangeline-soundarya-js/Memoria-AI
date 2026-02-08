import { PrimaryCategory } from './types';

export const CATEGORY_COLORS: Record<string, string> = {
  'Learning': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Career': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Mental Health': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Fitness': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Tech': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Entertainment': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Others': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

export const PLATFORMS = ['YouTube', 'Instagram', 'Reddit', 'Web/Blogs', 'Other'] as const;
export const CATEGORIES = ['Learning', 'Career', 'Mental Health', 'Fitness', 'Tech', 'Entertainment', 'Others'] as const;

export const PLATFORM_BRAND_COLORS: Record<string, string> = {
  'YouTube': 'bg-red-600',
  'Instagram': 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
  'Reddit': 'bg-[#ff4500]',
  'Web/Blogs': 'bg-[#0ea5e9]',
  'Other': 'bg-slate-600'
};

export const DEFAULT_CAT_COLOR = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

export const SYSTEM_PROMPT = `You are a professional content librarian and intelligence analyst.
Your task is to analyze user-provided URLs or text and extract precise metadata.

CRITICAL RULES:
1. PLATFORM DETECTION: Inspect the URL or text. If it's a youtube.com/youtu.be link, platform is 'YouTube'. If instagram.com, 'Instagram'. If reddit.com, 'Reddit'. Otherwise 'Web/Blogs' or 'Other'.
2. TITLE: Extract a compelling, accurate title.
3. SUMMARY (aiInsight): Write a clear, 1-sentence summary describing EXACTLY what the content is about.
4. CATEGORIZATION: Select the most appropriate category from (Learning, Career, Tech, Mental Health, Fitness, Entertainment, Others).
5. KEY POINTS: Extract 3 vital takeaways.

OUTPUT: Return ONLY a JSON object. No markdown, no preamble.
{
  "title": "...",
  "platform": "YouTube" | "Instagram" | "Reddit" | "Web/Blogs" | "Other",
  "category": "...",
  "subcategory": "...",
  "aiInsight": "...",
  "keyPoints": ["...", "...", "..."]
}`;