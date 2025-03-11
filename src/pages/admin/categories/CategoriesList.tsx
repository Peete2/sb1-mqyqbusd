import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../../../hooks/useApi';
import toast from 'react-hot-toast';

export default function CategoriesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categoriesData, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
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
        <p className="text-red-500">Error loading categories. Please try again.</p>
      </div>
    );
  }

  const filteredCategories = categoriesData?.data?.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600 mt-1">Manage content categories</p>
        </div>
        <Link
          to="/admin/categories/new"
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300"
        >
          <Plus size={20} className="mr-2" />
          New Category
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/categories/edit/${category.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{category.description || 'No description'}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Slug</span>
                  <span className="font-medium">{category.slug}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.status}
                  </span>
                </div>
                {category.parent && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Parent</span>
                    <span className="font-medium">{category.parent.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No categories found. {searchTerm && 'Try a different search term.'}
          </div>
        )}
      </div>
    </div>
  );
}