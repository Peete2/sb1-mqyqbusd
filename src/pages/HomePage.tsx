import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Filters from '../components/Filters';
import BlogGrid from '../components/BlogGrid';
import { SortOption, CategoryOption } from '../types';
import { homeApi } from '../lib/api';

export default function HomePage() {
  const [sort, setSort] = useState<SortOption>('recent');
  const [category, setCategory] = useState<CategoryOption>('all');
  const [showRecent, setShowRecent] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: homeContent, isLoading, error } = useQuery(
    ['home-content', page, sort, category, showRecent],
    () => homeApi.getContent({
      limit,
      offset: (page - 1) * limit,
      status: 'published',
      startDate: showRecent ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
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

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">Error loading content. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const { content, total_count, page_count } = homeContent || {};
  const { featured = [], latest = [], trending = [] } = content || {};

  const displayPosts = sort === 'popular' ? trending : 
                      sort === 'oldest' ? [...latest].reverse() : 
                      latest;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Latest News</h1>
          <div className="flex items-center space-x-2">
            <span className="text-red-600 font-bold">LIVE</span>
            <span className="text-gray-400">LATEST</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Filters
          sort={sort}
          setSort={setSort}
          category={category}
          setCategory={setCategory}
          showRecent={showRecent}
          setShowRecent={setShowRecent}
        />
      </div>

      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
          <BlogGrid posts={featured} />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {sort === 'popular' ? 'Trending Stories' : 'Latest Stories'}
        </h2>
        <BlogGrid posts={displayPosts} />
      </div>

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
    </main>
  );
}