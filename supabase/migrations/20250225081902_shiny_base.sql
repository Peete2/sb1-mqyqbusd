/*
  # Initial Schema Setup for Modern Times Media

  1. New Tables
    - authors
      - id (uuid, primary key)
      - name (text)
      - profile_picture (text)
      - email (text, unique)
      - password (text)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - categories
      - id (uuid, primary key)
      - name (text, unique)
      - slug (text, unique)
      - profile_picture (text)
      - description (text)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - posts
      - id (uuid, primary key)
      - category_id (uuid, foreign key)
      - author_id (uuid, foreign key)
      - title (text)
      - slug (text, unique)
      - content (text)
      - featured_image (text)
      - advert_image (text)
      - meta_description (text)
      - meta_keywords (text)
      - view_count (int)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - comments
      - id (uuid, primary key)
      - post_id (uuid, foreign key)
      - name (text)
      - email (text)
      - content (text)
      - status (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users


-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Authors table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    profile_picture TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    profile_picture TEXT,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id),
    author_id UUID NOT NULL REFERENCES authors(id),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    advert_image TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    view_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_comments_post ON comments(post_id);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authors are viewable by everyone"
    ON authors FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Published posts are viewable by everyone"
    ON posts FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Comments are viewable by everyone"
    ON comments FOR SELECT
    TO public
    USING (status = 'approved');

-- Admin policies
CREATE POLICY "Admins can manage authors"
    ON authors FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage posts"
    ON posts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage comments"
    ON comments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); */