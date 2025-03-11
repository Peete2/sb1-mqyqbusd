import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Define navigation items with role-based access
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'editor', 'writer'] },
    { name: 'Posts', href: '/admin/posts', icon: FileText, roles: ['admin', 'editor', 'writer'] },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen, roles: ['admin', 'editor'] },
    { name: 'Authors', href: '/admin/authors', icon: Users, roles: ['admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['admin'] },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    // Admin can access everything
    if (userRole === 'admin') return true;
    // Otherwise, check if the user's role is in the allowed roles
    return item.roles.includes(userRole || '');
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-semibold">Modern Times Media</span>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">
                Modern Times <span className="text-primary">Media</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-black'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Logged in as:</p>
                <p className="text-xs text-gray-500 capitalize">{userRole || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : ''
        } lg:ml-64`}
      >
        <div className="p-6 pt-20 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}