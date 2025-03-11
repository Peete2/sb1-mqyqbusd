import React, { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold font-outfit">Modern Times <span className="text-primary">Media</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#FFDD00] transition-colors">Home</Link>
              <Link to="/blog" className="text-gray-700 hover:text-[#FFDD00] transition-colors">Blog</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#FFDD00] transition-colors">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#FFDD00] transition-colors">Contact</Link>
            </div>

            {/* Search and Login */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
             <Link to="/admin"> <button className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300 flex items-center space-x-2">
                <User size={20} />
                <span>Admin Login</span>
              </button></Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-3 overflow-x-auto">
              <Link to="/category/news" className="text-black font-medium whitespace-nowrap hover:opacity-80 transition-opacity">News</Link>
              <Link to="/category/business" className="text-black font-medium whitespace-nowrap hover:opacity-80 transition-opacity">Business and Economics</Link>
              <Link to="/category/climate" className="text-black font-medium whitespace-nowrap hover:opacity-80 transition-opacity">Climate</Link>
              <Link to="/category/health" className="text-black font-medium whitespace-nowrap hover:opacity-80 transition-opacity">Health</Link>
              <Link to="/category/environment" className="text-black font-medium whitespace-nowrap hover:opacity-80 transition-opacity">Agric and Environment</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Home</Link>
              <Link to="/blog" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Blog</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">About</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Contact</Link>
            <Link to="/admin">  <button className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition duration-300">
                <User size={20} />
                <span>Admin Login</span>
              </button></Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}