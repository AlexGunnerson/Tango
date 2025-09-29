-- Alternative solution: Update featured materials to match existing games
-- This replaces Bottle and Deck of Cards with materials that existing games actually use

-- Remove current featured status from Bottle and Deck of Cards
UPDATE materials 
SET is_featured = false 
WHERE material IN ('Bottle', 'Deck of Cards');

-- Add featured status to materials that existing games actually use
UPDATE materials 
SET is_featured = true 
WHERE material IN (
    'Bowl',           -- Used by Marshmallow Scoop
    'Paper',          -- Used by Tearable Tree  
    'Cookies',        -- Used by Cookie Face Challenge
    'Paper Plate',    -- Used by Paper Plate Snowman1
    'Spatula'         -- Used by Marshmallow Scoop
) AND is_featured = false;  -- Only update if not already featured

-- Verify the changes
-- SELECT material, is_featured FROM materials WHERE is_featured = true ORDER BY material;
