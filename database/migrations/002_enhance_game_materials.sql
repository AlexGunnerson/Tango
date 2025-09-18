-- Migration: Enhance game_config_materials table with quantity and type
-- This allows us to specify how many items are needed and whether it's total or per-user

ALTER TABLE game_config_materials 
ADD COLUMN quantity INTEGER DEFAULT 1,
ADD COLUMN quantity_type TEXT DEFAULT 'TOTAL' CHECK (quantity_type IN ('TOTAL', 'PER_USER')),
ADD COLUMN notes TEXT;

-- Add indexes for better performance
CREATE INDEX idx_game_config_materials_quantity_type ON game_config_materials(quantity_type);

-- Add comments for documentation
COMMENT ON COLUMN game_config_materials.quantity IS 'Number of items required';
COMMENT ON COLUMN game_config_materials.quantity_type IS 'Whether quantity is TOTAL (for all players) or PER_USER (per individual player)';
COMMENT ON COLUMN game_config_materials.notes IS 'Optional notes about this material requirement for the game';

-- Example data updates (uncomment and modify as needed):
-- UPDATE game_config_materials SET quantity = 20, quantity_type = 'TOTAL', notes = 'For beer pong cups'
-- WHERE game_config_id IN (SELECT id FROM game_configs WHERE title LIKE '%Beer Pong%');

-- UPDATE game_config_materials SET quantity = 1, quantity_type = 'PER_USER', notes = 'Each player needs their own pen'
-- WHERE material_id IN (SELECT id FROM materials WHERE material LIKE '%pen%' OR material LIKE '%write%');
