import { supabase } from './auth';
import { PostgrestError } from '@supabase/supabase-js';
import { z } from 'zod';

// Validation schemas
export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().uuid('Invalid category ID'),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  scheduled_publish_time: z.string().datetime().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  parent_id: z.string().uuid('Invalid parent category ID').optional(),
});

export const mediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  path: z.string().min(1, 'Path is required'),
  mime_type: z.string().min(1, 'MIME type is required'),
  article_id: z.string().uuid('Invalid article ID').optional(),
});

// Types
export type Article = z.infer<typeof articleSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Media = z.infer<typeof mediaSchema>;

// API response type
type ApiResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

// Home API
export const homeApi = {
  async getContent(params?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    const { data, error } = await supabase.rpc('get_home_content', {
      p_limit: params?.limit || 10,
      p_offset: params?.offset || 0,
      p_start_date: params?.startDate?.toISOString(),
      p_end_date: params?.endDate?.toISOString(),
      p_status: params?.status || 'published'
    });

    if (error) throw error;
    return data;
  }
};

// Categories API
export const categoriesApi = {
  async list() {
    return await supabase
      .from('categories')
      .select('*, parent:categories(id, name)')
      .order('name');
  },

  async getContent(categoryId: string, params?: {
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'title' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    status?: string;
    tags?: string[];
  }) {
    const { data, error } = await supabase.rpc('get_category_content', {
      p_category_id: categoryId,
      p_limit: params?.limit || 10,
      p_offset: params?.offset || 0,
      p_sort_by: params?.sortBy || 'date',
      p_sort_order: params?.sortOrder || 'desc',
      p_status: params?.status || 'published',
      p_tags: params?.tags
    });

    if (error) throw error;
    return data;
  },

  async create(category: Category) {
    const validatedData = categorySchema.parse(category);
    return await supabase.from('categories').insert(validatedData);
  },

  async update(id: string, category: Partial<Category>) {
    const validatedData = categorySchema.partial().parse(category);
    return await supabase
      .from('categories')
      .update(validatedData)
      .eq('id', id);
  },

  async delete(id: string) {
    return await supabase.from('categories').delete().eq('id', id);
  },
};

// Articles API
export const articlesApi = {
  async list(page = 1, limit = 10, filters?: { category?: string; status?: string }) {
    const start = (page - 1) * limit;
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name),
        author:authors(id, name, profile_picture)
      `)
      .range(start, start + limit - 1)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    return await query;
  },

  async getBySlug(slug: string) {
    return await supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name),
        author:authors(id, name, profile_picture)
      `)
      .eq('slug', slug)
      .single();
  },

  async create(article: Article) {
    const validatedData = articleSchema.parse(article);
    
    // Handle scheduled publishing
    if (validatedData.scheduled_publish_time) {
      const { data: articleData, error: articleError } = await supabase
        .from('posts')
        .insert({
          ...validatedData,
          status: 'draft'
        })
        .select()
        .single();

      if (articleError) throw articleError;

      const { error: scheduleError } = await supabase
        .from('content_schedules')
        .insert({
          content_id: articleData.id,
          content_type: 'posts',
          scheduled_time: validatedData.scheduled_publish_time,
          action: 'publish',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (scheduleError) throw scheduleError;

      return { data: articleData, error: null };
    }

    return await supabase.from('posts').insert(validatedData);
  },

  async update(id: string, article: Partial<Article>) {
    const validatedData = articleSchema.partial().parse(article);
    return await supabase
      .from('posts')
      .update(validatedData)
      .eq('id', id);
  },

  async delete(id: string) {
    return await supabase.from('posts').delete().eq('id', id);
  },
};

// Media API
export const mediaApi = {
  async upload(file: File, articleId?: string) {
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filename, file);

    if (error) {
      throw error;
    }

    const mediaRecord = {
      filename: file.name,
      path: data.path,
      mime_type: file.type,
      article_id: articleId,
    };

    return await supabase.from('media').insert(mediaRecord);
  },

  async list(articleId?: string) {
    let query = supabase.from('media').select('*');
    
    if (articleId) {
      query = query.eq('article_id', articleId);
    }

    return await query.order('uploaded_at', { ascending: false });
  },

  async delete(id: string) {
    const { data: media } = await supabase
      .from('media')
      .select('path')
      .eq('id', id)
      .single();

    if (media) {
      await supabase.storage.from('media').remove([media.path]);
    }

    return await supabase.from('media').delete().eq('id', id);
  },
};

// Audit Logs API
export const auditApi = {
  async list(params?: {
    contentType?: string;
    contentId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('content_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (params?.contentType) {
      query = query.eq('content_type', params.contentType);
    }

    if (params?.contentId) {
      query = query.eq('content_id', params.contentId);
    }

    if (params?.startDate) {
      query = query.gte('created_at', params.startDate.toISOString());
    }

    if (params?.endDate) {
      query = query.lte('created_at', params.endDate.toISOString());
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    return await query;
  }
};