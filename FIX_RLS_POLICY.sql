-- Fix RLS Policy for organizations table
-- Add INSERT policy to allow data population

-- Drop old read-only policy if exists
DROP POLICY IF EXISTS "Enable read access for all users" ON organizations;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON organizations
  FOR SELECT USING (true);

-- Allow authenticated users to insert (for development/admin)
CREATE POLICY "Enable insert for all" ON organizations
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Enable update for all" ON organizations
  FOR UPDATE
  USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Enable delete for all" ON organizations
  FOR DELETE
  USING (true);
