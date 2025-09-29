-- Migration: Add games that use the featured materials (Bottle, Deck of Cards)
-- This fixes the mismatch where featured materials don't match any game requirements

-- First, let's add some games that use Bottle and Deck of Cards
INSERT INTO games (
  id,
  title,
  description,
  game_type,
  min_players,
  max_players,
  has_timer,
  timer_duration,
  times_up_instruction,
  is_active,
  is_premium,
  created_at,
  updated_at
) VALUES 
-- Game 1: Bottle Flip Challenge
(
  'game-bottle-flip',
  'Bottle Flip Challenge',
  'See who can land the most bottle flips in a row',
  'competitive',
  2,
  6,
  true,
  60,
  'Time''s up! Count your successful flips!',
  true,
  false,
  NOW(),
  NOW()
),
-- Game 2: Card Tower Challenge  
(
  'game-card-tower',
  'Card Tower Challenge',
  'Build the tallest tower using only playing cards',
  'competitive',
  2,
  4,
  true,
  120,
  'Time''s up! Measure your towers!',
  true,
  false,
  NOW(),
  NOW()
),
-- Game 3: Last Card Standing (uses both bottle and cards)
(
  'game-last-card-standing',
  'Last Card Standing',
  'Use a bottle to knock down card structures - last player with cards standing wins',
  'competitive',
  2,
  4,
  false,
  NULL,
  'Game over when only one player has cards remaining!',
  true,
  false,
  NOW(),
  NOW()
);

-- Now add the material requirements for these games
-- First, get the material IDs for Bottle and Deck of Cards
DO $$
DECLARE
  bottle_id UUID;
  cards_id UUID;
BEGIN
  -- Get material IDs
  SELECT id INTO bottle_id FROM materials WHERE material = 'Bottle' LIMIT 1;
  SELECT id INTO cards_id FROM materials WHERE material = 'Deck of Cards' LIMIT 1;
  
  -- Add material requirements for Bottle Flip Challenge
  INSERT INTO game_materials (
    id,
    game_id,
    material_id,
    quantity_required,
    quantity_type,
    alternative_1,
    alternative_2,
    alternative_3,
    notes,
    created_at
  ) VALUES (
    gen_random_uuid(),
    'game-bottle-flip',
    bottle_id,
    1,
    'TOTAL',
    true,  -- Allow alternative 1
    false, -- Don't allow alternative 2
    false, -- Don't allow alternative 3
    'Any plastic bottle that can be flipped',
    NOW()
  );
  
  -- Add material requirements for Card Tower Challenge
  INSERT INTO game_materials (
    id,
    game_id,
    material_id,
    quantity_required,
    quantity_type,
    alternative_1,
    alternative_2,
    alternative_3,
    notes,
    created_at
  ) VALUES (
    gen_random_uuid(),
    'game-card-tower',
    cards_id,
    1,
    'TOTAL',
    true,  -- Allow alternative 1
    true,  -- Allow alternative 2
    false, -- Don't allow alternative 3
    'Standard deck of playing cards',
    NOW()
  );
  
  -- Add material requirements for Last Card Standing (needs both bottle and cards)
  INSERT INTO game_materials (
    id,
    game_id,
    material_id,
    quantity_required,
    quantity_type,
    alternative_1,
    alternative_2,
    alternative_3,
    notes,
    created_at
  ) VALUES 
  (
    gen_random_uuid(),
    'game-last-card-standing',
    bottle_id,
    1,
    'TOTAL',
    true,  -- Allow alternative 1
    false, -- Don't allow alternative 2
    false, -- Don't allow alternative 3
    'Bottle for knocking down cards',
    NOW()
  ),
  (
    gen_random_uuid(),
    'game-last-card-standing',
    cards_id,
    1,
    'PER_USER',
    true,  -- Allow alternative 1
    true,  -- Allow alternative 2
    false, -- Don't allow alternative 3
    'Each player needs their own deck',
    NOW()
  );
END $$;

-- Add some comments for documentation
COMMENT ON TABLE games IS 'Game configurations and rules - now includes games for all featured materials';
COMMENT ON TABLE game_materials IS 'Links games to required materials - now covers Bottle and Deck of Cards';
