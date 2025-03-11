import React from 'react';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
        >
          <div className="relative pb-[56.25%]">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{post.category}</span>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 font-['Roboto'] line-clamp-2">{post.title}</h2>
            <p className="text-gray-600 font-['Open_Sans'] line-clamp-3">{post.preview}</p>
            <Link 
              to={`/article/${post.id}`}
              className="mt-4 inline-block px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-opacity-80 transition duration-300"
            >
              Read More
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}