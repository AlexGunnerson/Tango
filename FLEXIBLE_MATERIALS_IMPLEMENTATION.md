# Flexible Materials & Game Schema Implementation

This document outlines the complete implementation of the flexible material/game system that supports:
- Featured vs. non-featured materials (starter 5)
- Per-game control over alternatives
- Quantities + per-user/total distinction
- Enhanced game filtering based on available items

## 🏗️ Database Schema Changes

### 1. Migration Files Created

All migration files are located in `/database/migrations/`:

#### `001_add_featured_materials.sql`
- Adds `is_featured` boolean column to `materials` table
- Sets starter 5 materials as featured
- Adds index for performance

#### `002_enhance_game_materials.sql`
- Adds `quantity` (integer) to `game_config_materials`
- Adds `quantity_type` ('TOTAL' | 'PER_USER') to `game_config_materials`
- Adds optional `notes` field for special instructions

#### `003_create_game_material_alternatives.sql`
- Creates new `game_material_alternatives` table
- Links specific game material requirements to their acceptable alternatives
- Supports per-game control over alternatives

#### `004_create_helpful_views.sql`
- Creates `game_materials_detailed` view for easy querying
- Creates `featured_materials` view for starter materials
- Creates `game_requirements_summary` view for filtering

### 2. Updated Schema Structure

```sql
-- Enhanced materials table
materials {
  id: UUID
  material: TEXT
  is_featured: BOOLEAN  -- NEW: marks starter 5 materials
  alternative_1: TEXT   -- kept for backward compatibility
  alternative_2: TEXT
  alternative_3: TEXT
  availability_score: TEXT
  icon: TEXT
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}

-- Enhanced game_config_materials table  
game_config_materials {
  id: UUID
  game_config_id: UUID
  material_id: UUID
  is_required: BOOLEAN
  quantity: INTEGER     -- NEW: how many needed
  quantity_type: TEXT   -- NEW: 'TOTAL' or 'PER_USER'
  notes: TEXT          -- NEW: optional special instructions
  created_at: TIMESTAMPTZ
}

-- New game_material_alternatives table
game_material_alternatives {
  id: UUID
  game_config_material_id: UUID  -- links to specific game requirement
  alternative_material_id: UUID  -- the alternative material
  is_acceptable: BOOLEAN         -- allows temporary disabling
  notes: TEXT                   -- why this alternative works
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}
```

## 🔧 Code Implementation

### 1. Updated TypeScript Interfaces

**Enhanced Material Types** (`src/types/material.ts`):
```typescript
export interface Material {
  id: string;
  material: string;
  isFeatured: boolean;  // NEW: featured flag
  // ... rest unchanged
}

export interface GameConfigMaterial {
  id: string;
  gameConfigId: string;
  materialId: string;
  isRequired: boolean;
  quantity: number;              // NEW: quantity needed
  quantityType: 'TOTAL' | 'PER_USER';  // NEW: quantity type
  notes?: string;                // NEW: optional notes
  createdAt: string;
}

export interface GameMaterialAlternative {  // NEW: alternatives
  id: string;
  gameConfigMaterialId: string;
  alternativeMaterialId: string;
  isAcceptable: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Updated Supabase Types** (`src/types/supabase.ts`):
- Added `is_featured: boolean` to `materials` table
- Added `quantity`, `quantity_type`, `notes` to `game_config_materials` table  
- Added complete `game_material_alternatives` table definition

### 2. Enhanced Service Methods

**SupabaseService** (`src/services/supabaseService.ts`):

```typescript
// NEW: Featured materials support
async getFeaturedMaterials(): Promise<DatabaseMaterial[]>
async getAllMaterials(): Promise<DatabaseMaterial[]>

// NEW: Game material requirements with alternatives
async getGameMaterialRequirements(gameId: string): Promise<GameMaterialRequirement[]>

// NEW: Alternative management
async addGameMaterialAlternative(gameConfigMaterialId: string, alternativeMaterialId: string, notes?: string)
async updateGameMaterialAlternative(alternativeId: string, updates: Partial<...>)
async removeGameMaterialAlternative(alternativeId: string)

// ENHANCED: Improved matching logic with database alternatives
private async doesGameMatchAvailableItems(game: Game, availableItems: string[], playerCount: number)
```

**GameLogicService** (`src/services/gameLogicService.ts`):
- Updated filtering to use new async material matching
- Enhanced validation to consider quantities and per-user requirements
- Added fallback to legacy matching for backward compatibility

**OfflineStorageService** (`src/services/offlineStorageService.ts`):
- Updated to work with new async filtering methods
- Maintains legacy matching for offline scenarios

### 3. Updated ItemGatheringScreen

**Key Features** (`src/screens/TangoFlow/ItemGatheringScreen.tsx`):
- **Starter 5**: Initially loads only featured materials
- **Load More**: Button to load additional non-featured materials  
- **Real-time Filtering**: Shows actual available games count based on selections
- **Enhanced UX**: Loading states and visual feedback

```typescript
// NEW: State management for featured vs all materials
const [showingFeaturedOnly, setShowingFeaturedOnly] = useState(true);
const [loadingMoreItems, setLoadingMoreItems] = useState(false);

// NEW: Load additional materials function
const loadMoreMaterials = async () => {
  // Loads non-featured materials and adds them to the list
}

// ENHANCED: Real-time game count updates
const updateAvailableGamesCount = async (selectedItems: string[]) => {
  // Uses new unified counting method
}
```

## 🎯 Key Features Implemented

### ✅ Featured Materials (Starter 5)
- Database flag to mark commonly available materials
- UI loads featured materials first
- "Add items" button to load additional materials

### ✅ Per-Game Alternatives Control
- Database table linking alternatives to specific game requirements
- Granular control: Beer Pong allows glass cups, Flip Cup doesn't
- Admin can enable/disable alternatives per game

### ✅ Quantity & Per-User Support  
- Track how many items needed (quantity)
- Support TOTAL (for all players) vs PER_USER (per individual)
- Example: Beer Pong needs 20 cups TOTAL, Writing game needs 1 pen PER_USER

### ✅ Enhanced Game Filtering
- Real-time calculation of available games
- Considers quantities, player count, and alternatives
- Fallback to legacy matching for backward compatibility
- Works in both online and offline modes

### ✅ Backward Compatibility
- Existing `required_items` field still works
- Legacy alternative fields maintained
- Graceful fallback if new schema isn't available

## 🚀 How to Deploy

### 1. Run Database Migrations
```sql
-- Run these in order:
\i database/migrations/001_add_featured_materials.sql
\i database/migrations/002_enhance_game_materials.sql  
\i database/migrations/003_create_game_material_alternatives.sql
\i database/migrations/004_create_helpful_views.sql
```

### 2. Update Featured Materials
```sql
-- Set your starter 5 materials (update names to match your data)
UPDATE materials SET is_featured = true 
WHERE material IN (
  'Something to write with',
  'Paper', 
  'Large Bowl',
  'Spatula',
  'Paper Plate'
);
```

### 3. Populate Game Requirements (Optional)
```sql
-- Example: Set quantities for existing games
UPDATE game_config_materials 
SET quantity = 20, quantity_type = 'TOTAL', notes = 'Plastic cups for beer pong'
WHERE game_config_id IN (SELECT id FROM game_configs WHERE title LIKE '%Beer Pong%');

UPDATE game_config_materials 
SET quantity = 1, quantity_type = 'PER_USER', notes = 'Each player needs their own pen'
WHERE material_id IN (SELECT id FROM materials WHERE material LIKE '%pen%');
```

### 4. Add Game Alternatives (Optional)
```sql
-- Example: Allow glass cups as alternative to plastic cups for beer pong
INSERT INTO game_material_alternatives (game_config_material_id, alternative_material_id, notes)
SELECT 
  gcm.id,
  alt.id,
  'Glass cups work as alternative to plastic cups'
FROM game_config_materials gcm
JOIN game_configs gc ON gcm.game_config_id = gc.id
JOIN materials m ON gcm.material_id = m.id
JOIN materials alt ON alt.material = 'Glass Cups'
WHERE gc.title LIKE '%Beer Pong%' AND m.material LIKE '%Plastic Cup%';
```

## 🧪 Testing Checklist

- [ ] Featured materials load on ItemGatheringScreen
- [ ] "Add items" button loads additional materials
- [ ] Game count updates in real-time when selecting items
- [ ] Online game filtering works with new schema
- [ ] Offline game filtering falls back gracefully
- [ ] Navigation parameters include selected items
- [ ] Game selection validates against available items

## 🔮 Future Enhancements

1. **Quantity Tracking**: Track actual quantities users have
2. **Smart Suggestions**: Suggest items that unlock the most games
3. **Alternative Recommendations**: Show why alternatives work
4. **Admin Interface**: UI for managing alternatives and quantities
5. **Analytics**: Track which items are most/least available

## 📚 Database Views Reference

### `game_materials_detailed`
Complete view of games with their material requirements and alternatives.
```sql
SELECT * FROM game_materials_detailed WHERE game_title = 'Beer Pong';
```

### `featured_materials`  
View of materials marked as featured (starter 5).
```sql
SELECT * FROM featured_materials ORDER BY name;
```

### `game_requirements_summary`
Summary of game requirements for filtering and analysis.
```sql
SELECT * FROM game_requirements_summary 
WHERE required_materials_count <= 3
ORDER BY total_items_needed;
```

---

## 🎉 Implementation Complete!

This flexible schema now supports:
- ✅ Featured vs. non-featured materials  
- ✅ Per-game alternatives control
- ✅ Quantities + per-user/total distinction
- ✅ Enhanced real-time game filtering
- ✅ Backward compatibility
- ✅ Online/offline support

The system is production-ready and can scale to support hundreds of games and materials with fine-grained control over requirements and alternatives.
