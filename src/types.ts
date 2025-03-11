export interface Author {
  id: string;
  name: string;
  profile_picture?: string;
  email: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  articles?: number;
  totalViews?: number;
  engagement?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  profile_picture?: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  articleCount?: number;
  totalViews?: number;
  engagement?: number;
}

export interface BlogPost {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  featured_image?: string;
  advert_image?: string;
  meta_description?: string;
  meta_keywords?: string;
  view_count: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  category?: Category;
  author?: Author;
  preview?: string;
  thumbnail?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  engagement?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
}

export type SortOption = 'recent' | 'oldest' | 'popular';
export type CategoryOption = 'all' | 'news' | 'business' | 'agric' | 'climate' | 'health';

export interface CategoryData {
  title: string;
  description: string;
  featured: BlogPost;
  posts: BlogPost[];
}