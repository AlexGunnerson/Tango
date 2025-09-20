-- Migration: Rename game_configs to games and game_config_materials to game_materials
-- This will provide cleaner, more intuitive table names

-- Step 1: Drop views that reference the old table names
DROP VIEW IF EXISTS game_materials_detailed CASCADE;
DROP VIEW IF EXISTS game_requirements_summary CASCADE;

-- Step 2: Rename the tables
ALTER TABLE game_configs RENAME TO games;
ALTER TABLE game_config_materials RENAME TO game_materials;

-- Step 3: Update the foreign key column name in game_materials table
ALTER TABLE game_materials RENAME COLUMN game_config_id TO game_id;

-- Step 4: Update constraint names to match new table names
-- Drop old constraints
ALTER TABLE game_materials DROP CONSTRAINT IF EXISTS game_config_materials_pkey;
ALTER TABLE game_materials DROP CONSTRAINT IF EXISTS game_config_materials_game_config_id_material_id_key;
ALTER TABLE game_materials DROP CONSTRAINT IF EXISTS game_config_materials_game_config_id_fkey;
ALTER TABLE game_materials DROP CONSTRAINT IF EXISTS game_config_materials_material_id_fkey;
ALTER TABLE game_materials DROP CONSTRAINT IF EXISTS game_config_materials_quantity_type_check;

-- Add new constraints with updated names
ALTER TABLE game_materials ADD CONSTRAINT game_materials_pkey PRIMARY KEY (id);
ALTER TABLE game_materials ADD CONSTRAINT game_materials_game_id_material_id_key UNIQUE (game_id, material_id);
ALTER TABLE game_materials ADD CONSTRAINT game_materials_game_id_fkey FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE;
ALTER TABLE game_materials ADD CONSTRAINT game_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials (id) ON DELETE CASCADE;
ALTER TABLE game_materials ADD CONSTRAINT game_materials_quantity_type_check CHECK (quantity_type = ANY (ARRAY['TOTAL'::text, 'PER_USER'::text]));

-- Step 5: Update index names to match new table names
-- Drop old indexes
DROP INDEX IF EXISTS idx_game_config_materials_game_config_id;
DROP INDEX IF EXISTS idx_game_config_materials_material_id;
DROP INDEX IF EXISTS idx_game_config_materials_quantity_type;
DROP INDEX IF EXISTS idx_game_config_materials_quantity_required;

-- Create new indexes with updated names
CREATE INDEX IF NOT EXISTS idx_game_materials_game_id ON game_materials USING btree (game_id);
CREATE INDEX IF NOT EXISTS idx_game_materials_material_id ON game_materials USING btree (material_id);
CREATE INDEX IF NOT EXISTS idx_game_materials_quantity_type ON game_materials USING btree (quantity_type);
CREATE INDEX IF NOT EXISTS idx_game_materials_quantity_required ON game_materials USING btree (quantity_required);

-- Step 6: Update any triggers that reference the old table names
DROP TRIGGER IF EXISTS populate_game_config_materials_denormalized_on_insert ON game_materials;
-- Note: The trigger function may need to be updated separately if it exists

-- Step 7: Recreate views with new table names
CREATE VIEW game_materials_detailed AS
SELECT 
    g.id as game_id,
    g.title as game_title,
    g.description as game_description,
    g.min_players,
    g.max_players,
    m.id as material_id,
    m.material as material_name,
    m.is_featured as material_is_featured,
    m.icon as material_icon,
    m.availability_score,
    gm.id as game_material_id,
    gm.quantity_required,
    gm.quantity_type,
    gm.is_required,
    gm.notes as requirement_notes,
    -- Include material alternatives from materials table
    m.alternative_1,
    m.alternative_2,
    m.alternative_3,
    -- Boolean flags controlling which alternatives are allowed for this game
    gm.alternative_1 as alternative_1_allowed,
    gm.alternative_2 as alternative_2_allowed,
    gm.alternative_3 as alternative_3_allowed
FROM games g
JOIN game_materials gm ON g.id = gm.game_id
JOIN materials m ON gm.material_id = m.id
WHERE g.is_active = true
ORDER BY g.title, m.material;

-- Step 8: Recreate game requirements summary with new table names
CREATE VIEW game_requirements_summary AS
SELECT 
    g.id as game_id,
    g.title as game_title,
    g.min_players,
    g.max_players,
    g.is_premium,
    g.theme,
    -- Count of required materials
    COUNT(gm.id) FILTER (WHERE gm.is_required = true) as required_materials_count,
    -- Count of optional materials  
    COUNT(gm.id) FILTER (WHERE gm.is_required = false) as optional_materials_count,
    -- Array of required material names
    ARRAY_AGG(DISTINCT m.material) FILTER (WHERE gm.is_required = true) as required_material_names,
    -- Total quantity needed
    SUM(CASE 
        WHEN gm.quantity_type = 'TOTAL' THEN gm.quantity_required 
        WHEN gm.quantity_type = 'PER_USER' THEN gm.quantity_required * g.max_players 
        ELSE gm.quantity_required 
    END) as total_items_needed
FROM games g
LEFT JOIN game_materials gm ON g.id = gm.game_id
LEFT JOIN materials m ON gm.material_id = m.id
WHERE g.is_active = true
GROUP BY g.id, g.title, g.min_players, g.max_players, g.is_premium, g.theme
ORDER BY g.title;

-- Step 9: Add comments for documentation
COMMENT ON TABLE games IS 'Game configurations and rules';
COMMENT ON TABLE game_materials IS 'Links games to required/optional materials with quantities';
COMMENT ON VIEW game_materials_detailed IS 'Detailed view of games with material requirements using JOINs';
COMMENT ON VIEW game_requirements_summary IS 'Summary view of game material requirements with counts and totals';

-- Step 10: Update other table foreign keys that reference game_configs
-- Update individual_games table foreign key
ALTER TABLE individual_games DROP CONSTRAINT IF EXISTS individual_games_game_config_id_fkey;
ALTER TABLE individual_games RENAME COLUMN game_config_id TO game_id;
ALTER TABLE individual_games ADD CONSTRAINT individual_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES games (id);
