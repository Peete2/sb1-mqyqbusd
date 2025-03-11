import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryHeaderProps {
  title: string;
  description: string;
  category: string;
}

export default function CategoryHeader({ title, description, category }: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="capitalize">{category}</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Roboto']">{title}</h1>
      <p className="text-lg text-gray-600 font-['Open_Sans']">{description}</p>
    </div>
  );
}