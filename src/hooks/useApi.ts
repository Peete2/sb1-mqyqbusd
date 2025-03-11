import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, categoriesApi, mediaApi } from '../lib/api';
import toast from 'react-hot-toast';

// Articles hooks
export function useArticles(page = 1, filters?: { category?: string; status?: string }) {
  return useQuery(['articles', page, filters], () => articlesApi.list(page, 10, filters));
}

export function useArticle(slug: string) {
  return useQuery(['article', slug], () => articlesApi.getBySlug(slug));
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation(articlesApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      toast.success('Article created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create article');
      console.error(error);
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: any }) => articlesApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['articles']);
        toast.success('Article updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update article');
        console.error(error);
      },
    }
  );
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  
  return useMutation(articlesApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete article');
      console.error(error);
    },
  });
}

// Categories hooks
export function useCategories() {
  return useQuery(['categories'], categoriesApi.list);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(categoriesApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create category');
      console.error(error);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: any }) => categoriesApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        toast.success('Category updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update category');
        console.error(error);
      },
    }
  );
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(categoriesApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category');
      console.error(error);
    },
  });
}

// Media hooks
export function useMedia(articleId?: string) {
  return useQuery(['media', articleId], () => mediaApi.list(articleId));
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ file, articleId }: { file: File; articleId?: string }) =>
      mediaApi.upload(file, articleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['media']);
        toast.success('Media uploaded successfully');
      },
      onError: (error) => {
        toast.error('Failed to upload media');
        console.error(error);
      },
    }
  );
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  
  return useMutation(mediaApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      toast.success('Media deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete media');
      console.error(error);
    },
  });
}