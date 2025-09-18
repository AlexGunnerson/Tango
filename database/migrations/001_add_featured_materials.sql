-- Migration: Add featured flag to materials table
-- This allows us to mark "starter 5" materials that show by default

ALTER TABLE materials 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Set the starter 5 materials as featured
-- Update these material names to match your actual database values
UPDATE materials 
SET is_featured = true 
WHERE material IN (
    'Something to write with',
    'Paper', 
    'Large Bowl',
    'Spatula',
    'Paper Plate'
);

-- Add index for better performance when querying featured materials
CREATE INDEX idx_materials_is_featured ON materials(is_featured);

-- Add comment for documentation
COMMENT ON COLUMN materials.is_featured IS 'Flag to indicate if this material should be shown in the starter set on the item gathering screen';
