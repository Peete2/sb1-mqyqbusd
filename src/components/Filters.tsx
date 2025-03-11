import React from 'react';
import { SortOption, CategoryOption } from '../types';

interface FiltersProps {
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  category: CategoryOption;
  setCategory: (category: CategoryOption) => void;
  showRecent: boolean;
  setShowRecent: (show: boolean) => void;
}

export default function Filters({
  sort,
  setSort,
  category,
  setCategory,
  showRecent,
  setShowRecent,
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[#F5F5F5] p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryOption)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        >
          <option value="all">All Categories</option>
          <option value="news">News</option>
           <option value="health">Health</option>
          <option value="business">Business</option>
          <option value="climate">Climate</option>
          <option value="Agric">Agric</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showRecent}
            onChange={(e) => setShowRecent(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFDD00] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFDD00]"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">Recently Added</span>
        </label>
      </div>
    </div>
  );
}