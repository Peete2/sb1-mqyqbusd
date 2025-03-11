/*
  # User Registration System Implementation

  1. Database Changes
    - Remove role from auth.users
    - Add role handling in authors table
    - Set up synchronization triggers

  2. Security
    - Update RLS policies for role-based access
    - Handle user deletion synchronization
*/

-- Remove role column from auth.users if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE auth.users DROP COLUMN role;
  END IF;
END $$;

-- Ensure authors table has the correct role column
DO $$
BEGIN
  ALTER TABLE public.authors 
    ALTER COLUMN role SET DEFAULT 'admin'::TEXT,
    ALTER COLUMN role SET NOT NULL;
END $$;

-- Create or replace function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.authors (
    id,
    name,
    email,
    password,
    role,
    status
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous'),
    NEW.email,
    'MANAGED_BY_SUPABASE_AUTH',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')::TEXT,
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.authors WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion();

-- Update RLS policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Authors are viewable by everyone" ON authors;
  DROP POLICY IF EXISTS "Admins can manage authors" ON authors;
  DROP POLICY IF EXISTS "Writers can update own profile" ON authors;
  DROP POLICY IF EXISTS "Editors can manage writers" ON authors;

  -- Create new policies
  CREATE POLICY "Authors are viewable by everyone"
    ON authors FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Admins can manage authors"
    ON authors FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = auth.uid()
        AND authors.role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = auth.uid()
        AND authors.role = 'admin'
      )
    );

  CREATE POLICY "Writers can update own profile"
    ON authors FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

  CREATE POLICY "Editors can manage writers"
    ON authors FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = auth.uid()
        AND authors.role = 'editor'
      ) AND
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = authors.id
        AND authors.role = 'writer'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = auth.uid()
        AND authors.role = 'editor'
      ) AND
      EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = authors.id
        AND authors.role = 'writer'
      )
    );
END
$$;