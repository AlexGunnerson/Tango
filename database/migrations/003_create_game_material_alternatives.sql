-- Migration: Create game_material_alternatives table
-- This allows per-game control over which materials can substitute for others

CREATE TABLE game_material_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_config_material_id UUID NOT NULL REFERENCES game_config_materials(id) ON DELETE CASCADE,
    alternative_material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    is_acceptable BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure we don't have duplicate alternatives for the same game material
    UNIQUE(game_config_material_id, alternative_material_id)
);

-- Add indexes for better performance
CREATE INDEX idx_game_material_alternatives_game_config_material ON game_material_alternatives(game_config_material_id);
CREATE INDEX idx_game_material_alternatives_alternative_material ON game_material_alternatives(alternative_material_id);
CREATE INDEX idx_game_material_alternatives_acceptable ON game_material_alternatives(is_acceptable);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_material_alternatives_updated_at 
    BEFORE UPDATE ON game_material_alternatives 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE game_material_alternatives IS 'Defines which materials can be used as alternatives for specific games';
COMMENT ON COLUMN game_material_alternatives.game_config_material_id IS 'References the specific material requirement for a game';
COMMENT ON COLUMN game_material_alternatives.alternative_material_id IS 'The material that can be used as an alternative';
COMMENT ON COLUMN game_material_alternatives.is_acceptable IS 'Whether this alternative is currently acceptable (allows temporary disabling)';
COMMENT ON COLUMN game_material_alternatives.notes IS 'Optional notes about why this alternative works or any special considerations';
