import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Clock } from 'lucide-react';

interface FeaturedArticleProps {
  article: BlogPost;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            {article.author && (
              <>
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{article.author.name}</p>
                  <p className="text-sm text-gray-300">{article.date}</p>
                </div>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-['Roboto']">{article.title}</h1>
          <p className="text-lg mb-6 text-gray-200 line-clamp-2">{article.preview}</p>
          <div className="flex items-center gap-6">
            <Link
              to={`/article/${article.id}`}
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-opacity-80 transition duration-300"
            >
              Read Full Story
            </Link>
            {article.readTime && (
              <div className="flex items-center text-gray-300">
                <Clock size={20} className="mr-2" />
                <span>{article.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}