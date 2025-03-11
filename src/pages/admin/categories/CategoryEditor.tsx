import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory } from '../../../hooks/useApi';
import toast from 'react-hot-toast';
import slugify from 'slugify';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: 'active',
    }
  });

  const name = watch('name');

  useEffect(() => {
    if (name) {
      setValue('slug', slugify(name, { lower: true }));
    }
  }, [name, setValue]);

  useEffect(() => {
    if (id && categoriesData?.data) {
      const category = categoriesData.data.find(cat => cat.id === id);
      if (category) {
        setValue('name', category.name);
        setValue('slug', category.slug);
        setValue('description', category.description || '');
        setValue('parent_id', category.parent_id || '');
        setValue('status', category.status as 'active' | 'inactive');
      }
    }
  }, [id, categoriesData, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (id) {
        await updateCategory.mutateAsync({
          id,
          data
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(data);
        toast.success('Category created successfully');
      }
      navigate('/admin/categories');
    } catch (error) {
      toast.error(id ? 'Failed to update category' : 'Failed to create category');
      console.error(error);
    }
  };

  if (categoriesLoading) {
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
            onClick={() => navigate('/admin/categories')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{id ? 'Edit Category' : 'New Category'}</h1>
            <p className="text-gray-600 mt-1">Create or edit a content category</p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createCategory.isLoading || updateCategory.isLoading}
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300 disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {createCategory.isLoading || updateCategory.isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              {...register('slug')}
              type="text"
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category (Optional)
            </label>
            <select
              {...register('parent_id')}
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">None</option>
              {categoriesData?.data
                ?.filter(cat => cat.id !== id) // Prevent selecting self as parent
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}