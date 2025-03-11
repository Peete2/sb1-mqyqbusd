import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CategoryHeader from '../components/CategoryHeader';
import FeaturedArticle from '../components/FeaturedArticle';
import BlogGrid from '../components/BlogGrid';
import AdBanner from '../components/AdBanner';
import { categoriesApi } from '../lib/api';

export default function CategoryPage() {
  const { category = '' } = useParams();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const limit = 9;

  const { data: categoryContent, isLoading, error } = useQuery(
    ['category-content', category, page, sortBy],
    () => categoriesApi.getContent(category, {
      limit,
      offset: (page - 1) * limit,
      sortBy,
      status: 'published'
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryContent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">Category not found or error loading content.</p>
          </div>
        </div>
      </div>
    );
  }

  const { content, total_count, page_count } = categoryContent;
  const { category: categoryData, posts = [], subcategories = [] } = content;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryHeader
          title={categoryData.name}
          description={categoryData.description || ''}
          category={category}
        />

        {posts.length > 0 && posts[0] && (
          <FeaturedArticle article={posts[0]} />
        )}
        
        <AdBanner type="inline" />

        {subcategories.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcat) => (
                <a
                  key={subcat.id}
                  href={`/category/${subcat.slug}`}
                  className="px-4 py-2 bg-white rounded-full text-sm hover:bg-primary hover:text-black transition-colors"
                >
                  {subcat.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'popularity')}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="date">Most Recent</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
          
          <BlogGrid posts={posts.slice(1)} />

          {page_count > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {page_count}
              </span>
              <button
                onClick={() => setPage(p => Math.min(page_count, p + 1))}
                disabled={page === page_count}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}