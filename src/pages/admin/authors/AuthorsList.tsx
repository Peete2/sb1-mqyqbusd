import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/auth';
import toast from 'react-hot-toast';

export default function AuthorsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: authors, isLoading, error } = useQuery(['authors'], async () => {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  });
  
  const deleteAuthor = useMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['authors']);
        toast.success('Author deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete author');
      }
    }
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      deleteAuthor.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">Error loading authors. Please try again.</p>
      </div>
    );
  }

  const filteredAuthors = authors?.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-gray-600 mt-1">Manage content creators</p>
        </div>
        <Link
          to="/admin/authors/new"
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300"
        >
          <Plus size={20} className="mr-2" />
          New Author
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <input
          type="text"
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.length > 0 ? (
          filteredAuthors.map((author) => (
            <div key={author.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <img
                  src={author.profile_picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{author.name}</h3>
                  <p className="text-sm text-gray-600">{author.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium capitalize">{author.role || 'writer'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    author.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {author.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">
                    {new Date(author.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Link
                  to={`/admin/authors/edit/${author.id}`}
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No authors found. {searchTerm && 'Try a different search term.'}
          </div>
        )}
      </div>
    </div>
  );
}