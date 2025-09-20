-- Migration: Remove is_required column from game_materials table
-- Simplify the schema by assuming all materials linked to a game are required

-- Step 1: Drop views that reference the is_required column
DROP VIEW IF EXISTS game_materials_detailed CASCADE;
DROP VIEW IF EXISTS game_requirements_summary CASCADE;

-- Step 2: Remove the is_required column from game_materials table
ALTER TABLE game_materials DROP COLUMN IF EXISTS is_required;

-- Step 3: Recreate views without is_required references
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

-- Step 4: Recreate game requirements summary without is_required logic
CREATE VIEW game_requirements_summary AS
SELECT 
    g.id as game_id,
    g.title as game_title,
    g.min_players,
    g.max_players,
    g.is_premium,
    g.theme,
    -- Count of materials (all are now considered required)
    COUNT(gm.id) as required_materials_count,
    -- No optional materials since is_required is removed
    0 as optional_materials_count,
    -- Array of material names (all are required)
    ARRAY_AGG(DISTINCT m.material) as required_material_names,
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

-- Step 5: Add comments for documentation
COMMENT ON VIEW game_materials_detailed IS 'Detailed view of games with material requirements - all materials are considered required';
COMMENT ON VIEW game_requirements_summary IS 'Summary view of game material requirements - simplified without optional/required distinction';
COMMENT ON TABLE game_materials IS 'Links games to required materials with quantities - all linked materials are considered required';
