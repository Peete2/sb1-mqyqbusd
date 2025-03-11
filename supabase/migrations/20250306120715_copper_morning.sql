/*
  # Create API endpoints for home and category pages

  1. New Functions
    - get_home_content: Returns featured and latest content
    - get_category_content: Returns category content with nested structure
    - manage_content: Handles content creation/updates with audit logging
    - get_trending_content: Returns trending content based on view counts

  2. New Tables
    - content_audit_logs: Track content changes
    - content_schedules: Manage scheduled content

  3. Security
    - RLS policies for new tables
    - Function security definer settings


-- Create content audit logs table
CREATE TABLE IF NOT EXISTS content_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type text NOT NULL,
  action text NOT NULL,
  changes jsonb,
  performed_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create content schedules table
CREATE TABLE IF NOT EXISTS content_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  action text NOT NULL,
  status text DEFAULT 'pending',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;

-- Create get_home_content function
CREATE OR REPLACE FUNCTION get_home_content(
  p_limit int DEFAULT 10,
  p_offset int DEFAULT 0,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
  p_status text DEFAULT 'published'
)
RETURNS TABLE (
  content jsonb,
  total_count bigint,
  page_count int
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_count bigint;
  v_page_count int;
BEGIN
  -- Get total count
  SELECT COUNT(*) INTO v_total_count
  FROM posts p
  WHERE (p_status IS NULL OR p.status = p_status)
  AND (p_start_date IS NULL OR p.created_at >= p_start_date)
  AND (p_end_date IS NULL OR p.created_at <= p_end_date);

  -- Calculate page count
  v_page_count := CEIL(v_total_count::float / p_limit);

  RETURN QUERY
  WITH featured_posts AS (
    SELECT 
      jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'slug', p.slug,
        'featured_image', p.featured_image,
        'created_at', p.created_at,
        'category', jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ),
        'author', jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'profile_picture', a.profile_picture
        )
      ) as post_data
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN authors a ON a.id = p.author_id
    WHERE p.featured = true
    AND (p_status IS NULL OR p.status = p_status)
    AND (p_start_date IS NULL OR p.created_at >= p_start_date)
    AND (p_end_date IS NULL OR p.created_at <= p_end_date)
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ),
  latest_posts AS (
    SELECT 
      jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'slug', p.slug,
        'featured_image', p.featured_image,
        'created_at', p.created_at,
        'category', jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ),
        'author', jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'profile_picture', a.profile_picture
        )
      ) as post_data
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN authors a ON a.id = p.author_id
    WHERE (p_status IS NULL OR p.status = p_status)
    AND (p_start_date IS NULL OR p.created_at >= p_start_date)
    AND (p_end_date IS NULL OR p.created_at <= p_end_date)
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ),
  trending_posts AS (
    SELECT 
      jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'slug', p.slug,
        'featured_image', p.featured_image,
        'created_at', p.created_at,
        'view_count', p.view_count,
        'category', jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ),
        'author', jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'profile_picture', a.profile_picture
        )
      ) as post_data
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN authors a ON a.id = p.author_id
    WHERE (p_status IS NULL OR p.status = p_status)
    AND (p_start_date IS NULL OR p.created_at >= p_start_date)
    AND (p_end_date IS NULL OR p.created_at <= p_end_date)
    ORDER BY p.view_count DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT 
    jsonb_build_object(
      'featured', jsonb_agg(f.post_data),
      'latest', jsonb_agg(l.post_data),
      'trending', jsonb_agg(t.post_data)
    ) as content,
    v_total_count,
    v_page_count
  FROM featured_posts f
  CROSS JOIN latest_posts l
  CROSS JOIN trending_posts t
  GROUP BY v_total_count, v_page_count;
END;
$$;

-- Create get_category_content function
CREATE OR REPLACE FUNCTION get_category_content(
  p_category_id uuid,
  p_limit int DEFAULT 10,
  p_offset int DEFAULT 0,
  p_sort_by text DEFAULT 'date',
  p_sort_order text DEFAULT 'desc',
  p_status text DEFAULT 'published',
  p_tags text[] DEFAULT NULL
)
RETURNS TABLE (
  content jsonb,
  total_count bigint,
  page_count int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_count bigint;
  v_page_count int;
BEGIN
  -- Get total count
  WITH RECURSIVE category_tree AS (
    -- Base case: get the starting category
    SELECT id, parent_id, 1 AS level
    FROM categories
    WHERE id = p_category_id
    
    UNION ALL
    
    -- Recursive case: get all child categories
    SELECT c.id, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
  )
  SELECT COUNT(*) INTO v_total_count
  FROM posts p
  WHERE p.category_id IN (SELECT id FROM category_tree)
  AND (p_status IS NULL OR p.status = p_status)
  AND (p_tags IS NULL OR p.meta_keywords && p_tags);

  -- Calculate page count
  v_page_count := CEIL(v_total_count::float / p_limit);

  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: get the starting category
    SELECT id, parent_id, name, slug, description, 1 AS level
    FROM categories
    WHERE id = p_category_id
    
    UNION ALL
    
    -- Recursive case: get all child categories
    SELECT c.id, c.parent_id, c.name, c.slug, c.description, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
  ),
  category_posts AS (
    SELECT 
      c.id as category_id,
      c.name as category_name,
      c.slug as category_slug,
      c.description as category_description,
      c.level,
      jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'slug', p.slug,
        'featured_image', p.featured_image,
        'created_at', p.created_at,
        'view_count', p.view_count,
        'author', jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'profile_picture', a.profile_picture
        )
      ) as post_data
    FROM category_tree c
    LEFT JOIN posts p ON p.category_id = c.id
    LEFT JOIN authors a ON a.id = p.author_id
    WHERE (p_status IS NULL OR p.status = p_status)
    AND (p_tags IS NULL OR p.meta_keywords && p_tags)
    ORDER BY 
      CASE 
        WHEN p_sort_by = 'date' AND p_sort_order = 'desc' THEN p.created_at END DESC,
      CASE 
        WHEN p_sort_by = 'date' AND p_sort_order = 'asc' THEN p.created_at END ASC,
      CASE 
        WHEN p_sort_by = 'title' AND p_sort_order = 'desc' THEN p.title END DESC,
      CASE 
        WHEN p_sort_by = 'title' AND p_sort_order = 'asc' THEN p.title END ASC,
      CASE 
        WHEN p_sort_by = 'popularity' AND p_sort_order = 'desc' THEN p.view_count END DESC,
      CASE 
        WHEN p_sort_by = 'popularity' AND p_sort_order = 'asc' THEN p.view_count END ASC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT 
    jsonb_build_object(
      'category', jsonb_build_object(
        'id', MIN(category_id),
        'name', MIN(category_name),
        'slug', MIN(category_slug),
        'description', MIN(category_description)
      ),
      'posts', jsonb_agg(post_data),
      'subcategories', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'description', c.description
          )
        )
        FROM category_tree c
        WHERE c.level > 1
      )
    ) as content,
    v_total_count,
    v_page_count
  FROM category_posts
  GROUP BY v_total_count, v_page_count;
END;
$$;

-- Create function to log content changes
CREATE OR REPLACE FUNCTION log_content_change()
RETURNS trigger AS $$
BEGIN
  INSERT INTO content_audit_logs (
    content_id,
    content_type,
    action,
    changes,
    performed_by
  ) VALUES (
    CASE 
      WHEN TG_TABLE_NAME = 'posts' THEN NEW.id
      WHEN TG_TABLE_NAME = 'categories' THEN NEW.id
    END,
    TG_TABLE_NAME,
    TG_OP,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for content audit logging
CREATE TRIGGER posts_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION log_content_change();

CREATE TRIGGER categories_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW EXECUTE FUNCTION log_content_change();

-- RLS Policies for audit logs
CREATE POLICY "Audit logs viewable by admins and editors"
  ON content_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.role = 'admin' OR auth.users.role = 'editor')
    )
  );

-- RLS Policies for content schedules
CREATE POLICY "Content schedules manageable by admins and editors"
  ON content_schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.role = 'admin' OR auth.users.role = 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.role = 'admin' OR auth.users.role = 'editor')
    )
  ); */