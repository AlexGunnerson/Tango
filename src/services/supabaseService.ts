import { supabase } from '../lib/supabase';
import { Game, GameType } from '../types/game';

// Supabase database types that match our schema
export interface DatabasePlayer {
  id: string;
  name: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  total_games_played: number;
  total_wins: number;
  total_losses: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseGameConfig {
  id: string;
  title: string;
  description: string;
  theme?: string;
  required_items: string[];
  min_players: number;
  max_players: number;
  video_url?: string;
  has_timer: boolean;
  timer_duration?: number;
  game_type: string;
  is_premium: boolean;
  is_active: boolean;
  times_up_instruction?: string;
  player_action?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePunishment {
  id: string;
  name: string;
  description: string;
  category?: string;
  difficulty?: string;
  duration_seconds?: number;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseGameSession {
  id: string;
  player1_id: string;
  player2_id: string;
  punishment_id?: string;
  available_items: string[];
  selected_games: string[];
  current_game_index: number;
  current_round: number;
  max_rounds: number;
  player1_score: number;
  player2_score: number;
  status: string;
  winner_id?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseIndividualGame {
  id: string;
  session_id: string;
  game_config_id: string;
  round_number: number;
  winner_id?: string;
  player1_handicap?: any;
  player2_handicap?: any;
  gameplay_duration?: number;
  notes?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface DatabaseMatchHistory {
  id: string;
  session_id: string;
  player1_id: string;
  player2_id: string;
  winner_id?: string;
  final_score_p1: number;
  final_score_p2: number;
  total_games_played: number;
  session_duration?: number;
  punishment_completed?: boolean;
  completed_at: string;
  created_at: string;
}

export interface DatabaseMaterial {
  id: string;
  material: string;
  is_featured: boolean;
  alternative_1?: string;
  alternative_2?: string;
  alternative_3?: string;
  availability_score: '1-Everyone Has It' | '2 - 9/10 people have it' | '3 - 5/10 people have it' | '4 - Seasonal';
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseGameConfigMaterial {
  id: string;
  game_config_id: string;
  material_id: string;
  is_required: boolean;
  quantity: number;
  quantity_type: 'TOTAL' | 'PER_USER';
  notes?: string;
  created_at: string;
}

export interface DatabaseGameMaterialAlternative {
  id: string;
  game_config_material_id: string;
  alternative_material_id: string;
  is_acceptable: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GameMaterialRequirement {
  material_id: string;
  material_name: string;
  material_icon?: string;
  quantity: number;
  quantity_type: 'TOTAL' | 'PER_USER';
  is_required: boolean;
  notes?: string;
  alternatives: {
    id: string;
    name: string;
    icon?: string;
    notes?: string;
  }[];
}

// Filter interfaces
export interface GameFilters {
  theme?: string;
  maxPlayers?: number;
  minPlayers?: number;
  availableItems?: string[];
  isPremium?: boolean;
  gameType?: GameType;
}

export interface CreatePlayerData {
  name: string;
  email?: string;
  avatar_url?: string;
}

export interface CreateGameSessionData {
  player1_id: string;
  player2_id: string;
  punishment_id?: string;
  available_items: string[];
  selected_games: string[];
  current_game_index?: number;
  current_round?: number;
  player1_score?: number;
  player2_score?: number;
  status?: string;
}

export interface UpdateGameSessionData {
  current_game_index?: number;
  current_round?: number;
  player1_score?: number;
  player2_score?: number;
  status?: string;
  winner_id?: string;
  completed_at?: string;
}

export interface PlayerStats {
  total_games: number;
  wins: number;
  losses: number;
  win_percentage: number;
  recent_games: number;
  recent_wins: number;
}

class SupabaseService {
  // Helper method for improved item matching logic with database alternatives
  private async doesGameMatchAvailableItems(game: Game, availableItems: string[], playerCount: number = 2): Promise<boolean> {
    if (availableItems.length === 0) return true;
    
    try {
      // Get detailed material requirements for this game
      const requirements = await this.getGameMaterialRequirements(game.id);
      
      return requirements.every(req => {
        // Calculate total quantity needed
        const totalQuantityNeeded = req.quantity_type === 'PER_USER' 
          ? req.quantity * playerCount 
          : req.quantity;
        
        // Check if user has the primary material
        if (this.hasEnoughMaterial(availableItems, req.material_name, totalQuantityNeeded)) {
          return true;
        }
        
        // Check if user has any acceptable alternatives
        return req.alternatives.some(alt => 
          this.hasEnoughMaterial(availableItems, alt.name, totalQuantityNeeded)
        );
      });
    } catch (error) {
      console.error('Error checking game material requirements:', error);
      // Fallback to legacy string-based matching
      return this.doesGameMatchAvailableItemsLegacy(game, availableItems);
    }
  }

  // Legacy matching logic as fallback
  private doesGameMatchAvailableItemsLegacy(game: Game, availableItems: string[]): boolean {
    if (availableItems.length === 0) return true;
    
    return game.requiredItems.every(requiredItem => {
      return availableItems.some(availableItem => {
        const required = requiredItem.toLowerCase().trim();
        const available = availableItem.toLowerCase().trim();
        
        // Exact match
        if (available === required) return true;
        
        // Partial match (current logic)
        if (available.includes(required) || required.includes(available)) return true;
        
        // Handle common alternatives
        const alternatives: { [key: string]: string[] } = {
          'spoon': ['spoon', 'utensil', 'silverware', 'cutlery'],
          'bowl': ['bowl', 'container', 'dish'],
          'paper': ['paper', 'sheet', 'notebook', 'pad'],
          'pen': ['pen', 'pencil', 'marker', 'writing utensil', 'something to write with'],
          'pencil': ['pen', 'pencil', 'marker', 'writing utensil', 'something to write with'],
          'coins': ['coins', 'pennies', 'change', 'money'],
          'pennies': ['coins', 'pennies', 'change', 'money'],
        };
        
        // Check if required item has alternatives that match available items
        const requiredAlternatives = alternatives[required] || [];
        if (requiredAlternatives.some(alt => available.includes(alt.toLowerCase()))) return true;
        
        // Check if available item has alternatives that match required items
        for (const [key, alts] of Object.entries(alternatives)) {
          if (available.includes(key) && alts.some(alt => required.includes(alt.toLowerCase()))) {
            return true;
          }
        }
        
        return false;
      });
    });
  }

  // Helper to check if user has enough of a specific material
  private hasEnoughMaterial(availableItems: string[], materialName: string, quantityNeeded: number): boolean {
    // For now, we assume if the user has the item, they have enough
    // In the future, you could extend this to track quantities
    return availableItems.some(item => 
      item.toLowerCase().includes(materialName.toLowerCase()) ||
      materialName.toLowerCase().includes(item.toLowerCase())
    );
  }

  // Game Configuration Methods
  async getGameConfigs(): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('game_configs')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;

      return data.map(this.transformGameConfig);
    } catch (error) {
      console.error('Error fetching game configs:', error);
      throw error;
    }
  }

  async getGameById(id: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('game_configs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return this.transformGameConfig(data);
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      return null;
    }
  }

  async getGameByTitle(title: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('game_configs')
        .select('*')
        .eq('title', title)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return this.transformGameConfig(data);
    } catch (error) {
      console.error('Error fetching game by title:', error);
      return null;
    }
  }


  async getGamesByFilters(filters: GameFilters): Promise<Game[]> {
    try {
      let query = supabase
        .from('game_configs')
        .select('*')
        .eq('is_active', true);

      if (filters.theme) {
        query = query.eq('theme', filters.theme);
      }
      if (filters.maxPlayers) {
        query = query.lte('max_players', filters.maxPlayers);
      }
      if (filters.minPlayers) {
        query = query.gte('min_players', filters.minPlayers);
      }
      if (filters.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }
      if (filters.gameType) {
        query = query.eq('game_type', filters.gameType);
      }

      const { data, error } = await query.order('title');

      if (error) throw error;

      let games = data.map(this.transformGameConfig);

      // Filter by available items if provided using improved matching logic
      if (filters.availableItems && filters.availableItems.length > 0) {
        const filteredGames = [];
        for (const game of games) {
          const matches = await this.doesGameMatchAvailableItems(game, filters.availableItems, filters.maxPlayers || 2);
          if (matches) {
            filteredGames.push(game);
          }
        }
        games = filteredGames;
      }

      return games;
    } catch (error) {
      console.error('Error fetching games by filters:', error);
      throw error;
    }
  }

  async getRandomGames(count: number, filters?: GameFilters): Promise<Game[]> {
    try {
      const games = await this.getGamesByFilters(filters || {});
      
      // Shuffle array and return requested count
      const shuffled = [...games].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error('Error fetching random games:', error);
      throw error;
    }
  }

  async getAvailableGamesCount(selectedItems: string[]): Promise<number> {
    try {
      const filters: GameFilters = {
        maxPlayers: 2,
        minPlayers: 2,
        availableItems: selectedItems,
        isPremium: false // For now, only count free games
      };
      
      const games = await this.getGamesByFilters(filters);
      return games.length;
    } catch (error) {
      console.error('Error fetching available games count:', error);
      throw error;
    }
  }

  async getAvailableGamesCountUnified(selectedItems: string[]): Promise<number> {
    const { networkService } = await import('./networkService');
    const { offlineStorageService } = await import('./offlineStorageService');
    
    try {
      if (networkService.isOnline()) {
        // Online: Use Supabase
        return await this.getAvailableGamesCount(selectedItems);
      } else {
        // Offline: Use cached games
        return await offlineStorageService.getCachedAvailableGamesCount(selectedItems);
      }
    } catch (error) {
      console.error('Error fetching available games count (unified):', error);
      // Fallback to offline cache if online fails
      try {
        return await offlineStorageService.getCachedAvailableGamesCount(selectedItems);
      } catch (fallbackError) {
        console.error('Fallback to cached games also failed:', fallbackError);
        return 0;
      }
    }
  }

  // Player Management Methods
  async createPlayer(playerData: CreatePlayerData): Promise<DatabasePlayer> {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: playerData.name,
          display_name: playerData.name,
          email: playerData.email,
          avatar_url: playerData.avatar_url
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }

  async getPlayerById(id: string): Promise<DatabasePlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching player by ID:', error);
      return null;
    }
  }

  async getPlayerByName(name: string): Promise<DatabasePlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching player by name:', error);
      return null;
    }
  }

  async getOrCreatePlayer(name: string, email?: string): Promise<DatabasePlayer> {
    try {
      // Try to find existing player
      const existingPlayer = await this.getPlayerByName(name);
      if (existingPlayer) {
        return existingPlayer;
      }

      // Create new player
      return await this.createPlayer({ name, email });
    } catch (error) {
      console.error('Error getting or creating player:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_player_stats', { player_uuid: playerId });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_games: 0,
          wins: 0,
          losses: 0,
          win_percentage: 0,
          recent_games: 0,
          recent_wins: 0
        };
      }

      return {
        total_games: data[0].total_games || 0,
        wins: data[0].wins || 0,
        losses: data[0].losses || 0,
        win_percentage: data[0].win_percentage || 0,
        recent_games: data[0].recent_games || 0,
        recent_wins: data[0].recent_wins || 0
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  // Punishment Methods
  async getPunishments(): Promise<DatabasePunishment[]> {
    try {
      const { data, error } = await supabase
        .from('punishments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching punishments:', error);
      throw error;
    }
  }

  async getRandomPunishment(): Promise<DatabasePunishment | null> {
    try {
      const punishments = await this.getPunishments();
      if (punishments.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * punishments.length);
      return punishments[randomIndex];
    } catch (error) {
      console.error('Error fetching random punishment:', error);
      return null;
    }
  }

  async getPunishmentById(id: string): Promise<DatabasePunishment | null> {
    try {
      const { data, error } = await supabase
        .from('punishments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching punishment by ID:', error);
      return null;
    }
  }

  // Game Session Methods
  async createGameSession(sessionData: CreateGameSessionData): Promise<DatabaseGameSession> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  async getGameSession(id: string): Promise<DatabaseGameSession | null> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching game session:', error);
      return null;
    }
  }

  async updateGameSession(id: string, updates: UpdateGameSessionData): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating game session:', error);
      throw error;
    }
  }

  // Match History Methods
  async createMatchHistory(sessionId: string): Promise<DatabaseMatchHistory> {
    try {
      // First, get the game session data to create the match history
      const gameSession = await this.getGameSession(sessionId);
      if (!gameSession) {
        throw new Error(`Game session not found: ${sessionId}`);
      }

      const matchHistoryData = {
        session_id: sessionId,
        player1_id: gameSession.player1_id,
        player2_id: gameSession.player2_id,
        winner_id: gameSession.winner_id,
        final_score_p1: gameSession.player1_score,
        final_score_p2: gameSession.player2_score,
        total_games_played: gameSession.current_round - 1, // current_round is 1-indexed
        session_duration: null, // TODO: Calculate duration if needed
        punishment_completed: false, // TODO: Track punishment completion
        completed_at: gameSession.completed_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('match_history')
        .insert([matchHistoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating match history:', error);
      throw error;
    }
  }

  async getPlayerMatchHistory(playerId: string, limit: number = 10): Promise<DatabaseMatchHistory[]> {
    try {
      const { data, error } = await supabase
        .from('match_history')
        .select('*')
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching player match history:', error);
      throw error;
    }
  }

  // Individual Game Methods
  async createIndividualGame(gameData: Omit<DatabaseIndividualGame, 'id' | 'created_at' | 'started_at'>): Promise<DatabaseIndividualGame> {
    try {
      const { data, error } = await supabase
        .from('individual_games')
        .insert([gameData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating individual game:', error);
      throw error;
    }
  }

  async updateIndividualGame(id: string, updates: Partial<DatabaseIndividualGame>): Promise<void> {
    try {
      const { error } = await supabase
        .from('individual_games')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating individual game:', error);
      throw error;
    }
  }

  // Utility Methods
  private transformGameConfig(dbGame: DatabaseGameConfig): Game {
    return {
      id: dbGame.id,
      title: dbGame.title,
      description: dbGame.description,
      theme: dbGame.theme as any,
      requiredItems: dbGame.required_items,
      minPlayers: dbGame.min_players,
      maxPlayers: dbGame.max_players,
      videoUrl: dbGame.video_url,
      hasTimer: dbGame.has_timer,
      timerDuration: dbGame.timer_duration,
      gameType: dbGame.game_type as GameType,
      isPremium: dbGame.is_premium,
      timesUpInstruction: dbGame.times_up_instruction,
      playerAction: dbGame.player_action,
      createdAt: dbGame.created_at,
      updatedAt: dbGame.updated_at
    };
  }

  // Material Methods
  async getMaterials(options?: { featuredOnly?: boolean }): Promise<DatabaseMaterial[]> {
    try {
      let query = supabase
        .from('materials')
        .select('*');

      // Filter by featured status if specified
      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query.order('material');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  async getFeaturedMaterials(): Promise<DatabaseMaterial[]> {
    return this.getMaterials({ featuredOnly: true });
  }

  async getAllMaterials(): Promise<DatabaseMaterial[]> {
    return this.getMaterials();
  }

  async getMaterialById(id: string): Promise<DatabaseMaterial | null> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching material by ID:', error);
      return null;
    }
  }

  async getMaterialsByAvailability(availabilityScore: string): Promise<DatabaseMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('availability_score', availabilityScore)
        .order('material');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials by availability:', error);
      throw error;
    }
  }

  async getGameMaterialRequirements(gameId: string): Promise<GameMaterialRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('game_materials_detailed')
        .select('*')
        .eq('game_id', gameId);

      if (error) throw error;

      return (data || []).map(row => ({
        material_id: row.material_id,
        material_name: row.material_name,
        material_icon: row.material_icon,
        quantity: row.quantity,
        quantity_type: row.quantity_type as 'TOTAL' | 'PER_USER',
        is_required: row.is_required,
        notes: row.requirement_notes,
        alternatives: row.alternatives || []
      }));
    } catch (error) {
      console.error('Error fetching game material requirements:', error);
      throw error;
    }
  }

  async addGameMaterialAlternative(
    gameConfigMaterialId: string, 
    alternativeMaterialId: string, 
    notes?: string
  ): Promise<DatabaseGameMaterialAlternative> {
    try {
      const { data, error } = await supabase
        .from('game_material_alternatives')
        .insert({
          game_config_material_id: gameConfigMaterialId,
          alternative_material_id: alternativeMaterialId,
          is_acceptable: true,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding game material alternative:', error);
      throw error;
    }
  }

  async updateGameMaterialAlternative(
    alternativeId: string, 
    updates: Partial<Pick<DatabaseGameMaterialAlternative, 'is_acceptable' | 'notes'>>
  ): Promise<DatabaseGameMaterialAlternative> {
    try {
      const { data, error } = await supabase
        .from('game_material_alternatives')
        .update(updates)
        .eq('id', alternativeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating game material alternative:', error);
      throw error;
    }
  }

  async removeGameMaterialAlternative(alternativeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_material_alternatives')
        .delete()
        .eq('id', alternativeId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing game material alternative:', error);
      throw error;
    }
  }

  async getGameMaterials(gameConfigId: string): Promise<DatabaseMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('game_config_materials')
        .select(`
          materials!inner(*)
        `)
        .eq('game_config_id', gameConfigId);

      if (error) throw error;
      return data?.map(item => (item as any).materials) || [];
    } catch (error) {
      console.error('Error fetching game materials:', error);
      throw error;
    }
  }

  async linkGameToMaterial(gameConfigId: string, materialId: string, isRequired: boolean = true): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_config_materials')
        .insert([{
          game_config_id: gameConfigId,
          material_id: materialId,
          is_required: isRequired
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error linking game to material:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('game_configs')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();

// Export the class for testing
export { SupabaseService };
