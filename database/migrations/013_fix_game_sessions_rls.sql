-- Migration: Fix RLS policies for game_sessions table
-- This resolves the "new row violates row-level security policy" error

-- First, check if RLS is enabled and disable it temporarily to add policies
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can create game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can view their game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can update their game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Players can create game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Players can view game sessions they participate in" ON game_sessions;
DROP POLICY IF EXISTS "Players can update game sessions they participate in" ON game_sessions;

-- Re-enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies that allow players to manage game sessions they participate in
-- Policy 1: Allow players to create game sessions where they are player1 or player2
CREATE POLICY "Players can create game sessions" 
ON game_sessions FOR INSERT 
WITH CHECK (
  -- Allow if the current authenticated user matches one of the player IDs
  -- OR allow anonymous users (for guest mode)
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

-- Policy 2: Allow players to view game sessions they participate in
CREATE POLICY "Players can view their game sessions" 
ON game_sessions FOR SELECT 
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

-- Policy 3: Allow players to update game sessions they participate in
CREATE POLICY "Players can update their game sessions" 
ON game_sessions FOR UPDATE 
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

-- Policy 4: Allow players to delete game sessions they participate in (for cleanup)
CREATE POLICY "Players can delete their game sessions" 
ON game_sessions FOR DELETE 
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
COMMENT ON POLICY "Players can create game sessions" ON game_sessions 
IS 'Allows players to create game sessions where they are one of the participants. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can view their game sessions" ON game_sessions 
IS 'Allows players to view game sessions they participate in. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can update their game sessions" ON game_sessions 
IS 'Allows players to update game sessions they participate in. Supports both authenticated users and guest mode.';

COMMENT ON POLICY "Players can delete their game sessions" ON game_sessions 
IS 'Allows players to delete game sessions they participate in for cleanup purposes. Supports both authenticated users and guest mode.';
