CREATE TABLE IF NOT EXISTS saved_designs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  variant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own designs" ON saved_designs;
CREATE POLICY "Users can view their own designs"
ON saved_designs FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own designs" ON saved_designs;
CREATE POLICY "Users can insert their own designs"
ON saved_designs FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own designs" ON saved_designs;
CREATE POLICY "Users can update their own designs"
ON saved_designs FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own designs" ON saved_designs;
CREATE POLICY "Users can delete their own designs"
ON saved_designs FOR DELETE
USING (auth.uid() = user_id);

alter publication supabase_realtime add table saved_designs;