-- Migration: Fix RLS policies for players table
-- This ensures players can be created and accessed properly for game sessions

-- First check if user_id column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE players ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
  END IF;
END $$;

-- Disable RLS temporarily to modify policies
ALTER TABLE players DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can create players" ON players;
DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Users can update their players" ON players;
DROP POLICY IF EXISTS "Players are publicly viewable" ON players;
DROP POLICY IF EXISTS "Anyone can create player records" ON players;

-- Re-enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies for players table

-- Policy 1: Allow anyone to create player records (needed for guest mode and game sessions)
CREATE POLICY "Anyone can create player records" 
ON players FOR INSERT 
WITH CHECK (true);

-- Policy 2: Allow anyone to view player records (needed for game sessions and leaderboards)
CREATE POLICY "Players are publicly viewable" 
ON players FOR SELECT 
USING (true);

-- Policy 3: Allow users to update their own player records, or anyone for guest players
CREATE POLICY "Users can update their own players" 
ON players FOR UPDATE 
USING (
  -- Allow if no user_id (guest player) or user_id matches authenticated user
  user_id IS NULL OR user_id = auth.uid()
);

-- Policy 4: Allow deletion for cleanup (same rules as update)
CREATE POLICY "Users can delete their own players" 
ON players FOR DELETE 
USING (
  -- Allow if no user_id (guest player) or user_id matches authenticated user
  user_id IS NULL OR user_id = auth.uid()
);

-- Add comments for documentation
COMMENT ON POLICY "Anyone can create player records" ON players 
IS 'Allows creation of player records for both authenticated users and guest mode.';

COMMENT ON POLICY "Players are publicly viewable" ON players 
IS 'Allows viewing of all player records for game sessions and leaderboards.';

COMMENT ON POLICY "Users can update their own players" ON players 
IS 'Allows users to update their own player records, and allows updates to guest players.';

COMMENT ON POLICY "Users can delete their own players" ON players 
IS 'Allows users to delete their own player records, and allows deletion of guest players for cleanup.';
