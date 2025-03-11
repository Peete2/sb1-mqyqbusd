import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Image, Save, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/auth';
import toast from 'react-hot-toast';

const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'editor', 'writer']).default('writer'),
  status: z.enum(['active', 'inactive']).default('active'),
});

type AuthorFormData = z.infer<typeof authorSchema>;

export default function AuthorEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const { data: author, isLoading } = useQuery(
    ['author', id],
    async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    {
      enabled: !!id
    }
  );
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      role: 'writer',
      status: 'active',
    }
  });

  useEffect(() => {
    if (author) {
      setValue('name', author.name);
      setValue('email', author.email);
      setValue('role', author.role as 'admin' | 'editor' | 'writer');
      setValue('status', author.status as 'active' | 'inactive');
      
      if (author.profile_picture) {
        setProfileImagePreview(author.profile_picture);
      }
    }
  }, [author, setValue]);

  const createAuthor = useMutation(
    async (data: AuthorFormData & { profile_picture?: string }) => {
      const { error } = await supabase.from('authors').insert(data);
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['authors']);
        toast.success('Author created successfully');
        navigate('/admin/authors');
      },
      onError: () => {
        toast.error('Failed to create author');
      }
    }
  );

  const updateAuthor = useMutation(
    async ({ id, data }: { id: string; data: Partial<AuthorFormData & { profile_picture?: string }> }) => {
      const { error } = await supabase
        .from('authors')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['authors']);
        toast.success('Author updated successfully');
        navigate('/admin/authors');
      },
      onError: () => {
        toast.error('Failed to update author');
      }
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  });

  const onSubmit = async (data: AuthorFormData) => {
    try {
      // Handle image upload if there's a new image
      let profilePictureUrl = profileImagePreview;
      
      if (profileImage) {
        const filename = `${Date.now()}-${profileImage.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filename, profileImage);
          
        if (uploadError) throw uploadError;
        
        profilePictureUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profiles/${uploadData.path}`;
      }
      
      if (id) {
        await updateAuthor.mutateAsync({
          id,
          data: {
            ...data,
            profile_picture: profilePictureUrl
          }
        });
      } else {
        await createAuthor.mutateAsync({
          ...data,
          profile_picture: profilePictureUrl
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(id ? 'Failed to update author' : 'Failed to create author');
    }
  };

  if (isLoading) {
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
            onClick={() => navigate('/admin/authors')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{id ? 'Edit Author' : 'New Author'}</h1>
            <p className="text-gray-600 mt-1">Manage content creators</p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createAuthor.isLoading || updateAuthor.isLoading}
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300 disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {createAuthor.isLoading || updateAuthor.isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
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
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {id && '(Leave blank to keep current password)'}
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              {profileImagePreview ? (
                <img 
                  src={profileImagePreview} 
                  alt="Profile" 
                  className="mx-auto h-32 w-32 rounded-full object-cover"
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
            <h3 className="text-lg font-semibold mb-4">Author Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}