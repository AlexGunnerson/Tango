-- Migration: Create user_materials table for efficient game matching
-- This enables persistent storage of user's available materials and efficient game matching

-- Step 1: Create user_materials table
CREATE TABLE IF NOT EXISTS user_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  quantity_available integer NULL, -- NULL = "has some", integer = exact quantity
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Ensure a user can't have duplicate materials
  CONSTRAINT user_materials_user_material_unique UNIQUE (user_id, material_id)
);

-- Step 2: Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_materials_user_id ON user_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_materials_material_id ON user_materials(material_id);
CREATE INDEX IF NOT EXISTS idx_user_materials_quantity ON user_materials(quantity_available);

-- Step 3: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_materials_updated_at_trigger
  BEFORE UPDATE ON user_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_user_materials_updated_at();

-- Step 4: Create efficient view for user's available games
CREATE VIEW user_available_games AS
WITH user_material_coverage AS (
  -- For each user and game, calculate how many required materials they have
  SELECT 
    p.id as user_id,
    p.name as user_name,
    g.id as game_id,
    g.title as game_title,
    COUNT(gm.id) as total_materials_required,
    COUNT(CASE 
      -- Check if user has the primary material
      WHEN EXISTS (
        SELECT 1 FROM user_materials um 
        WHERE um.user_id = p.id 
        AND um.material_id = gm.material_id
        AND (
          um.quantity_available IS NULL  -- "has some" = always sufficient
          OR um.quantity_available >= CASE 
            WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * g.max_players
            ELSE gm.quantity_required
          END
        )
      ) THEN 1
      -- Check if user has allowed alternatives
      WHEN EXISTS (
        SELECT 1 FROM user_materials um
        JOIN materials m_alt ON um.material_id = m_alt.id
        JOIN materials m_req ON gm.material_id = m_req.id
        WHERE um.user_id = p.id
        AND (
          um.quantity_available IS NULL  -- "has some" = always sufficient
          OR um.quantity_available >= CASE 
            WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * g.max_players
            ELSE gm.quantity_required
          END
        )
        AND (
          (gm.alternative_1 = true AND m_alt.material = m_req.alternative_1) OR
          (gm.alternative_2 = true AND m_alt.material = m_req.alternative_2) OR
          (gm.alternative_3 = true AND m_alt.material = m_req.alternative_3)
        )
      ) THEN 1
    END) as materials_user_has
  FROM players p
  CROSS JOIN games g
  JOIN game_materials gm ON g.id = gm.game_id
  WHERE g.is_active = true
  GROUP BY p.id, p.name, g.id, g.title
)
SELECT 
  user_id,
  user_name,
  game_id,
  game_title,
  total_materials_required,
  materials_user_has,
  CASE 
    WHEN total_materials_required = materials_user_has THEN true
    ELSE false
  END as can_play_game
FROM user_material_coverage;

-- Step 5: Create function for efficient game recommendations with dynamic player count
CREATE OR REPLACE FUNCTION get_available_games_for_user(p_user_id uuid, p_player_count integer)
RETURNS TABLE (
  game_id uuid,
  game_title text,
  game_description text,
  min_players integer,
  max_players integer,
  can_play_with_player_count boolean,
  materials_needed integer,
  user_has_materials integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.title,
    g.description,
    g.min_players,
    g.max_players,
    (p_player_count >= g.min_players AND p_player_count <= g.max_players) as can_play_with_player_count,
    COUNT(gm.id)::integer as materials_needed,
    COUNT(CASE 
      -- Check primary material with dynamic player count
      WHEN EXISTS (
        SELECT 1 FROM user_materials um 
        WHERE um.user_id = p_user_id 
        AND um.material_id = gm.material_id
        AND (
          um.quantity_available IS NULL  -- "has some" = always sufficient
          OR um.quantity_available >= CASE 
            WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * p_player_count
            ELSE gm.quantity_required
          END
        )
      ) THEN 1
      -- Check alternatives with dynamic player count
      WHEN EXISTS (
        SELECT 1 FROM user_materials um
        JOIN materials m_alt ON um.material_id = m_alt.id
        JOIN materials m_req ON gm.material_id = m_req.id
        WHERE um.user_id = p_user_id
        AND (
          um.quantity_available IS NULL  -- "has some" = always sufficient
          OR um.quantity_available >= CASE 
            WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * p_player_count
            ELSE gm.quantity_required
          END
        )
        AND (
          (gm.alternative_1 = true AND m_alt.material = m_req.alternative_1) OR
          (gm.alternative_2 = true AND m_alt.material = m_req.alternative_2) OR
          (gm.alternative_3 = true AND m_alt.material = m_req.alternative_3)
        )
      ) THEN 1
    END)::integer as user_has_materials
  FROM games g
  JOIN game_materials gm ON g.id = gm.game_id
  WHERE g.is_active = true
    AND p_player_count >= g.min_players 
    AND p_player_count <= g.max_players
  GROUP BY g.id, g.title, g.description, g.min_players, g.max_players
  HAVING COUNT(gm.id) = COUNT(CASE 
    -- Same logic repeated for HAVING clause
    WHEN EXISTS (
      SELECT 1 FROM user_materials um 
      WHERE um.user_id = p_user_id 
      AND um.material_id = gm.material_id
      AND (
        um.quantity_available IS NULL
        OR um.quantity_available >= CASE 
          WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * p_player_count
          ELSE gm.quantity_required
        END
      )
    ) THEN 1
    WHEN EXISTS (
      SELECT 1 FROM user_materials um
      JOIN materials m_alt ON um.material_id = m_alt.id
      JOIN materials m_req ON gm.material_id = m_req.id
      WHERE um.user_id = p_user_id
      AND (
        um.quantity_available IS NULL
        OR um.quantity_available >= CASE 
          WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * p_player_count
          ELSE gm.quantity_required
        END
      )
      AND (
        (gm.alternative_1 = true AND m_alt.material = m_req.alternative_1) OR
        (gm.alternative_2 = true AND m_alt.material = m_req.alternative_2) OR
        (gm.alternative_3 = true AND m_alt.material = m_req.alternative_3)
      )
    ) THEN 1
  END)
  ORDER BY g.title;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Add helpful comments
COMMENT ON TABLE user_materials IS 'Stores which materials each user has available, with quantities';
COMMENT ON VIEW user_available_games IS 'Shows which games each user can play based on their available materials';
COMMENT ON FUNCTION get_available_games_for_user IS 'Efficiently returns all games a specific user can play with a given player count';

-- Step 7: Create indexes on the view's underlying tables for performance
-- (Already created above, but ensuring they exist)
CREATE INDEX IF NOT EXISTS idx_game_materials_game_id ON game_materials(game_id);
CREATE INDEX IF NOT EXISTS idx_game_materials_material_id ON game_materials(material_id);
