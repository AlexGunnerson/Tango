-- Migration: Fix RLS policies for match_history table
-- This resolves the "new row violates row-level security policy" error when recording final game results

-- First, disable RLS temporarily to modify policies
ALTER TABLE match_history DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can create match history" ON match_history;
DROP POLICY IF EXISTS "Users can view match history" ON match_history;
DROP POLICY IF EXISTS "Users can update match history" ON match_history;
DROP POLICY IF EXISTS "Players can create match history" ON match_history;
DROP POLICY IF EXISTS "Players can view their match history" ON match_history;
DROP POLICY IF EXISTS "Players can update their match history" ON match_history;

-- Re-enable RLS
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;

-- Create policies for match_history table

-- Policy 1: Allow players to create match history records for games they participated in
CREATE POLICY "Players can create their match history" 
ON match_history FOR INSERT 
WITH CHECK (
  -- Allow if anonymous (guest mode)
  auth.uid() IS NULL 
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player1_id 
    AND (
      -- If player has a user_id, it must match the authenticated user
      user_id IS NULL OR user_id = auth.uid()
    )
  )
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player2_id 
    AND (
      -- If player has a user_id, it must match the authenticated user
      user_id IS NULL OR user_id = auth.uid()
    )
  )
);

-- Policy 2: Allow players to view match history they participated in
CREATE POLICY "Players can view their match history" 
ON match_history FOR SELECT 
USING (
  -- Allow if anonymous (guest mode) - needed for leaderboards and stats
  auth.uid() IS NULL
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player1_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player2_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
);

-- Policy 3: Allow players to update match history they participated in (for corrections/updates)
CREATE POLICY "Players can update their match history" 
ON match_history FOR UPDATE 
USING (
  -- Allow if anonymous (guest mode)
  auth.uid() IS NULL
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player1_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player2_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
);

-- Policy 4: Allow deletion for cleanup (same rules as update)
CREATE POLICY "Players can delete their match history" 
ON match_history FOR DELETE 
USING (
  -- Allow if anonymous (guest mode)
  auth.uid() IS NULL
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player1_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM players 
    WHERE id = player2_id 
    AND (user_id IS NULL OR user_id = auth.uid())
  )
);

-- Add comments for documentation
COMMENT ON POLICY "Players can create their match history" ON match_history 
IS 'Allows players to create match history records for games they participated in. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can view their match history" ON match_history 
IS 'Allows players to view match history they participated in. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can update their match history" ON match_history 
IS 'Allows players to update match history they participated in for corrections. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can delete their match history" ON match_history 
IS 'Allows players to delete match history they participated in for cleanup purposes. Supports both authenticated users and guest mode.';
