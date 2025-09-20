-- Migration: Clean up game_config_materials table
-- Remove redundant columns that create duplicates:
-- 1. Remove 'quantity' (keep 'quantity_required') 
-- 2. Remove 'requirement_type' (keep 'quantity_type')
-- 3. Remove denormalized columns (game_title, material_name) - use JOINs instead

-- Step 1: Drop the redundant columns
ALTER TABLE game_config_materials 
DROP COLUMN IF EXISTS quantity,
DROP COLUMN IF EXISTS requirement_type,
DROP COLUMN IF EXISTS game_title,
DROP COLUMN IF EXISTS material_name;

-- Step 2: Drop any related indexes for removed columns (use IF EXISTS to be safe)
DROP INDEX IF EXISTS idx_game_config_materials_quantity;
DROP INDEX IF EXISTS idx_game_config_materials_requirement_type;
DROP INDEX IF EXISTS idx_game_config_materials_game_title;
DROP INDEX IF EXISTS idx_game_config_materials_material_name;

-- Step 3: Ensure we have proper indexes for the columns we're keeping
CREATE INDEX IF NOT EXISTS idx_game_config_materials_quantity_type ON game_config_materials(quantity_type);
CREATE INDEX IF NOT EXISTS idx_game_config_materials_quantity_required ON game_config_materials(quantity_required);

-- Step 3: Update the views to reflect the simplified schema
DROP VIEW IF EXISTS game_materials_detailed;
DROP VIEW IF EXISTS game_requirements_summary;

-- Step 4: Recreate views with proper JOINs and correct field names
CREATE VIEW game_materials_detailed AS
SELECT 
    gc.id as game_id,
    gc.title as game_title,
    gc.description as game_description,
    gc.min_players,
    gc.max_players,
    m.id as material_id,
    m.material as material_name, -- Material name from JOIN, not duplicated
    m.is_featured as material_is_featured,
    m.icon as material_icon,
    m.availability_score,
    gcm.id as game_material_id,
    gcm.quantity_required, -- Keep the correct quantity field
    gcm.quantity_type, -- Keep the correct quantity type field
    gcm.is_required,
    gcm.notes as requirement_notes,
    -- Include material alternatives from materials table
    m.alternative_1,
    m.alternative_2,
    m.alternative_3,
    -- Boolean flags controlling which alternatives are allowed for this game
    gcm.alternative_1 as alternative_1_allowed,
    gcm.alternative_2 as alternative_2_allowed,
    gcm.alternative_3 as alternative_3_allowed
FROM game_configs gc
JOIN game_config_materials gcm ON gc.id = gcm.game_config_id
JOIN materials m ON gcm.material_id = m.id
WHERE gc.is_active = true
ORDER BY gc.title, m.material;

-- Step 5: Recreate game requirements summary with correct fields
CREATE VIEW game_requirements_summary AS
SELECT 
    gc.id as game_id,
    gc.title as game_title,
    gc.min_players,
    gc.max_players,
    gc.is_premium,
    gc.theme,
    -- Count of required materials
    COUNT(gcm.id) FILTER (WHERE gcm.is_required = true) as required_materials_count,
    -- Count of optional materials  
    COUNT(gcm.id) FILTER (WHERE gcm.is_required = false) as optional_materials_count,
    -- Array of required material names (from JOIN, not duplicated storage)
    ARRAY_AGG(DISTINCT m.material) FILTER (WHERE gcm.is_required = true) as required_material_names,
    -- Total quantity needed (using correct field names)
    SUM(CASE 
        WHEN gcm.quantity_type = 'TOTAL' THEN gcm.quantity_required 
        WHEN gcm.quantity_type = 'PER_USER' THEN gcm.quantity_required * gc.max_players 
        ELSE gcm.quantity_required 
    END) as total_items_needed
FROM game_configs gc
LEFT JOIN game_config_materials gcm ON gc.id = gcm.game_config_id
LEFT JOIN materials m ON gcm.material_id = m.id
WHERE gc.is_active = true
GROUP BY gc.id, gc.title, gc.min_players, gc.max_players, gc.is_premium, gc.theme
ORDER BY gc.title;

-- Step 6: Add comments for documentation
COMMENT ON VIEW game_materials_detailed IS 'View of games with material requirements using JOINs - material names come from materials table';
COMMENT ON VIEW game_requirements_summary IS 'Summary view with proper JOINs and quantity calculations using quantity_required field';

-- Step 7: Add helpful comment explaining the design
COMMENT ON TABLE game_config_materials IS 'Links games to materials. Material names come from JOINs to materials table, not duplicated storage';
