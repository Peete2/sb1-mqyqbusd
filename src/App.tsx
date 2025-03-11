import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import PostsList from './pages/admin/posts/PostsList';
import PostEditor from './pages/admin/posts/PostEditor';
import CategoriesList from './pages/admin/categories/CategoriesList';
import CategoryEditor from './pages/admin/categories/CategoryEditor';
import AuthorsList from './pages/admin/authors/AuthorsList';
import AuthorEditor from './pages/admin/authors/AuthorEditor';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <>
                    <Navigation />
                    <HomePage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/category/:category"
                element={
                  <>
                    <Navigation />
                    <CategoryPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/article/:id"
                element={
                  <>
                    <Navigation />
                    <ArticlePage />
                    <Footer />
                  </>
                }
              />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                
                {/* Posts Routes - Editors and Admins */}
                <Route 
                  path="posts" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor', 'writer']}>
                      <PostsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="posts/new" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor', 'writer']}>
                      <PostEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="posts/edit/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor', 'writer']}>
                      <PostEditor />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Categories Routes - Editors and Admins Only */}
                <Route 
                  path="categories" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor']}>
                      <CategoriesList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="categories/new" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor']}>
                      <CategoryEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="categories/edit/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'editor']}>
                      <CategoryEditor />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Authors Routes - Admin Only */}
                <Route 
                  path="authors" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AuthorsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="authors/new" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AuthorEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="authors/edit/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AuthorEditor />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>

            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;