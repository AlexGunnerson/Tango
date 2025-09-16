import { supabase } from '../lib/supabase';
import { Game, GameCategory, GameDifficulty, GameType } from '../types/game';

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
  category: string;
  theme?: string;
  required_items: string[];
  min_players: number;
  max_players: number;
  estimated_duration: number;
  difficulty: string;
  instructions: string;
  video_url?: string;
  has_timer: boolean;
  timer_duration?: number;
  game_type: string;
  is_premium: boolean;
  is_active: boolean;
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

// Filter interfaces
export interface GameFilters {
  category?: GameCategory;
  theme?: string;
  maxPlayers?: number;
  minPlayers?: number;
  availableItems?: string[];
  isPremium?: boolean;
  difficulty?: GameDifficulty;
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

  async getGamesByCategory(category: GameCategory): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('game_configs')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;

      return data.map(this.transformGameConfig);
    } catch (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }
  }

  async getGamesByFilters(filters: GameFilters): Promise<Game[]> {
    try {
      let query = supabase
        .from('game_configs')
        .select('*')
        .eq('is_active', true);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
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
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.gameType) {
        query = query.eq('game_type', filters.gameType);
      }

      const { data, error } = await query.order('title');

      if (error) throw error;

      let games = data.map(this.transformGameConfig);

      // Filter by available items if provided
      if (filters.availableItems && filters.availableItems.length > 0) {
        games = games.filter(game =>
          game.requiredItems.every(item =>
            filters.availableItems!.some(availableItem =>
              availableItem.toLowerCase().includes(item.toLowerCase())
            )
          )
        );
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
      category: dbGame.category as GameCategory,
      theme: dbGame.theme as any,
      requiredItems: dbGame.required_items,
      minPlayers: dbGame.min_players,
      maxPlayers: dbGame.max_players,
      estimatedDuration: dbGame.estimated_duration,
      difficulty: dbGame.difficulty as GameDifficulty,
      instructions: dbGame.instructions,
      videoUrl: dbGame.video_url,
      hasTimer: dbGame.has_timer,
      timerDuration: dbGame.timer_duration,
      gameType: dbGame.game_type as GameType,
      isPremium: dbGame.is_premium,
      createdAt: dbGame.created_at,
      updatedAt: dbGame.updated_at
    };
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
