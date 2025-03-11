import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Modern Times <span className="text-primary">Media</span></h3>
            <p className="text-gray-400">
              Leading the way in digital media and content creation since 2025.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">News</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Khubetsoana, ka Motseng </li>
              <li>Berea 200</li>
              <li>moderntimesmediat@gmail.com</li>
              <li>+266 56278358/ 62436261</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
              <button className="px-4 py-2 bg-primary text-black rounded-r-lg hover:bg-opacity-80 transition duration-300">
                <Send size={20} />
              </button>
            </div>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFDD00] transition duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Modern Times Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}