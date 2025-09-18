-- Migration: Create helpful views for querying game materials and alternatives

-- View: Game materials with their alternatives
CREATE VIEW game_materials_detailed AS
SELECT 
    gc.id as game_id,
    gc.title as game_title,
    gc.description as game_description,
    gc.min_players,
    gc.max_players,
    m.id as material_id,
    m.material as material_name,
    m.is_featured as material_is_featured,
    m.icon as material_icon,
    gcm.id as game_material_id,
    gcm.quantity,
    gcm.quantity_type,
    gcm.is_required,
    gcm.notes as requirement_notes,
    -- Aggregate alternatives into arrays for easy access
    COALESCE(
        ARRAY_AGG(
            DISTINCT jsonb_build_object(
                'id', alt_m.id,
                'name', alt_m.material,
                'icon', alt_m.icon,
                'notes', gma.notes
            )
        ) FILTER (WHERE alt_m.id IS NOT NULL AND gma.is_acceptable = true),
        ARRAY[]::jsonb[]
    ) as alternatives
FROM game_configs gc
JOIN game_config_materials gcm ON gc.id = gcm.game_config_id
JOIN materials m ON gcm.material_id = m.id
LEFT JOIN game_material_alternatives gma ON gcm.id = gma.game_config_material_id AND gma.is_acceptable = true
LEFT JOIN materials alt_m ON gma.alternative_material_id = alt_m.id
WHERE gc.is_active = true
GROUP BY gc.id, gc.title, gc.description, gc.min_players, gc.max_players, 
         m.id, m.material, m.is_featured, m.icon,
         gcm.id, gcm.quantity, gcm.quantity_type, gcm.is_required, gcm.notes
ORDER BY gc.title, m.material;

-- View: Featured materials (for the starter 5)
CREATE VIEW featured_materials AS
SELECT 
    id,
    material as name,
    icon,
    availability_score,
    alternative_1,
    alternative_2,
    alternative_3,
    created_at,
    updated_at
FROM materials 
WHERE is_featured = true
ORDER BY material;

-- View: Game requirements summary (useful for filtering)
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
    -- Array of required material names (for backward compatibility with current filtering)
    ARRAY_AGG(DISTINCT m.material) FILTER (WHERE gcm.is_required = true) as required_items,
    -- Total quantity needed (useful for complexity scoring)
    SUM(CASE 
        WHEN gcm.quantity_type = 'TOTAL' THEN gcm.quantity 
        WHEN gcm.quantity_type = 'PER_USER' THEN gcm.quantity * gc.max_players 
        ELSE gcm.quantity 
    END) as total_items_needed
FROM game_configs gc
LEFT JOIN game_config_materials gcm ON gc.id = gcm.game_config_id
LEFT JOIN materials m ON gcm.material_id = m.id
WHERE gc.is_active = true
GROUP BY gc.id, gc.title, gc.min_players, gc.max_players, gc.is_premium, gc.theme
ORDER BY gc.title;

-- Add comments for documentation
COMMENT ON VIEW game_materials_detailed IS 'Comprehensive view of games with their material requirements and alternatives';
COMMENT ON VIEW featured_materials IS 'View of materials that should be shown by default in the item gathering screen';
COMMENT ON VIEW game_requirements_summary IS 'Summary view of game requirements, useful for filtering and complexity analysis';
