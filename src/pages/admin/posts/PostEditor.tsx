import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Image, Save, ArrowLeft } from 'lucide-react';
import { useArticle, useCreateArticle, useUpdateArticle, useCategories } from '../../../hooks/useApi';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MediaUploader from '../../../components/shared/MediaUploader';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().min(1, 'Category is required'),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  
  const { data: post, isLoading: postLoading } = useArticle(id || '');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'draft',
      featured: false,
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML());
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (title) {
      setValue('slug', slugify(title, { lower: true }));
    }
  }, [title, setValue]);

  useEffect(() => {
    if (post?.data && editor) {
      setValue('title', post.data.title);
      setValue('slug', post.data.slug);
      setValue('content', post.data.content);
      setValue('category_id', post.data.category_id);
      setValue('meta_description', post.data.meta_description || '');
      setValue('meta_keywords', post.data.meta_keywords || '');
      setValue('featured', post.data.featured || false);
      setValue('status', post.data.status as 'draft' | 'published' | 'archived');
      
      editor.commands.setContent(post.data.content);
      
      if (post.data.featured_image) {
        setFeaturedImagePreview(post.data.featured_image);
      }
    }
  }, [post, editor, setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFeaturedImage(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
    }
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      if (id) {
        await updateArticle.mutateAsync({
          id,
          data: {
            ...data,
            featured_image: featuredImagePreview || post?.data?.featured_image,
          }
        });
        toast.success('Post updated successfully');
      } else {
        await createArticle.mutateAsync({
          ...data,
          featured_image: featuredImagePreview,
          author_id: '1', // This should be the current user's ID
        });
        toast.success('Post created successfully');
      }
      navigate('/admin/posts');
    } catch (error) {
      toast.error(id ? 'Failed to update post' : 'Failed to create post');
      console.error(error);
    }
  };

  if (postLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/posts')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{id ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-gray-600 mt-1">Create or edit your article</p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createArticle.isLoading || updateArticle.isLoading}
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300 disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {createArticle.isLoading || updateArticle.isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <input
                {...register('title')}
                type="text"
                placeholder="Post title"
                className="w-full text-2xl font-bold border-2 border-gray-200 focus:border-primary focus:ring-0 rounded-lg p-2"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Slug:</span>
                <input
                  {...register('slug')}
                  type="text"
                  className="flex-1 border-2 border-gray-200 focus:border-primary focus:ring-0 rounded-lg p-2 text-sm"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              {editor && (
                <EditorContent 
                  editor={editor} 
                  className="prose max-w-none border-2 border-gray-200 rounded-lg p-4 min-h-[400px]"
                />
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Media Library</h3>
            <MediaUploader articleId={id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              {featuredImagePreview ? (
                <img 
                  src={featuredImagePreview} 
                  alt="Featured" 
                  className="mx-auto h-40 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Image size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register('category_id')}
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories?.data?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured post
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register('meta_description')}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Brief description for SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  {...register('meta_keywords')}
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}