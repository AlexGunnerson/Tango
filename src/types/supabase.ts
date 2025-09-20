export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      game_materials: {
        Row: {
          alternative_1: boolean | null
          alternative_2: boolean | null
          alternative_3: boolean | null
          created_at: string | null
          game_id: string
          id: string
          material_id: string
          notes: string | null
          quantity_required: number | null
          quantity_type: string | null
        }
        Insert: {
          alternative_1?: boolean | null
          alternative_2?: boolean | null
          alternative_3?: boolean | null
          created_at?: string | null
          game_id: string
          id?: string
          material_id: string
          notes?: string | null
          quantity_required?: number | null
          quantity_type?: string | null
        }
        Update: {
          alternative_1?: boolean | null
          alternative_2?: boolean | null
          alternative_3?: boolean | null
          created_at?: string | null
          game_id?: string
          id?: string
          material_id?: string
          notes?: string | null
          quantity_required?: number | null
          quantity_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_materials_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          description: string
          game_mode: string[] | null
          game_type: string
          has_timer: boolean
          id: string
          is_active: boolean
          is_premium: boolean
          max_players: number
          min_players: number
          player_action: string | null
          required_items: string[]
          theme: string | null
          timer_duration: number | null
          times_up_instruction: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          game_mode?: string[] | null
          game_type: string
          has_timer?: boolean
          id?: string
          is_active?: boolean
          is_premium?: boolean
          max_players?: number
          min_players?: number
          player_action?: string | null
          required_items?: string[]
          theme?: string | null
          timer_duration?: number | null
          times_up_instruction: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          game_mode?: string[] | null
          game_type?: string
          has_timer?: boolean
          id?: string
          is_active?: boolean
          is_premium?: boolean
          max_players?: number
          min_players?: number
          player_action?: string | null
          required_items?: string[]
          theme?: string | null
          timer_duration?: number | null
          times_up_instruction?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          archived_at: string | null
          available_items: string[]
          completed_at: string | null
          created_at: string | null
          current_game_index: number
          current_round: number
          id: string
          max_rounds: number
          paused_at: string | null
          player1_id: string
          player1_score: number
          player2_id: string
          player2_score: number
          punishment_id: string | null
          resumed_at: string | null
          selected_games: string[]
          started_at: string | null
          status: string
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          archived_at?: string | null
          available_items?: string[]
          completed_at?: string | null
          created_at?: string | null
          current_game_index?: number
          current_round?: number
          id?: string
          max_rounds?: number
          paused_at?: string | null
          player1_id: string
          player1_score?: number
          player2_id: string
          player2_score?: number
          punishment_id?: string | null
          resumed_at?: string | null
          selected_games?: string[]
          started_at?: string | null
          status?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          archived_at?: string | null
          available_items?: string[]
          completed_at?: string | null
          created_at?: string | null
          current_game_index?: number
          current_round?: number
          id?: string
          max_rounds?: number
          paused_at?: string | null
          player1_id?: string
          player1_score?: number
          player2_id?: string
          player2_score?: number
          punishment_id?: string | null
          resumed_at?: string | null
          selected_games?: string[]
          started_at?: string | null
          status?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_punishment_id_fkey"
            columns: ["punishment_id"]
            isOneToOne: false
            referencedRelation: "punishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      individual_games: {
        Row: {
          completed_at: string | null
          created_at: string | null
          game_id: string
          gameplay_duration: number | null
          id: string
          notes: string | null
          player1_handicap: Json | null
          player2_handicap: Json | null
          round_number: number
          session_id: string
          started_at: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          game_id: string
          gameplay_duration?: number | null
          id?: string
          notes?: string | null
          player1_handicap?: Json | null
          player2_handicap?: Json | null
          round_number: number
          session_id: string
          started_at?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          game_id?: string
          gameplay_duration?: number | null
          id?: string
          notes?: string | null
          player1_handicap?: Json | null
          player2_handicap?: Json | null
          round_number?: number
          session_id?: string
          started_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "individual_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "individual_games_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "individual_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "individual_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "individual_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          completed_at: string
          created_at: string | null
          final_score_p1: number
          final_score_p2: number
          game_categories: string[] | null
          games_breakdown: Json | null
          handicaps_used: Json | null
          id: string
          items_used: string[] | null
          performance_metrics: Json | null
          player1_id: string
          player2_id: string
          punishment_completed: boolean | null
          session_duration: number | null
          session_id: string
          total_games_played: number
          winner_id: string | null
        }
        Insert: {
          completed_at: string
          created_at?: string | null
          final_score_p1: number
          final_score_p2: number
          game_categories?: string[] | null
          games_breakdown?: Json | null
          handicaps_used?: Json | null
          id?: string
          items_used?: string[] | null
          performance_metrics?: Json | null
          player1_id: string
          player2_id: string
          punishment_completed?: boolean | null
          session_duration?: number | null
          session_id: string
          total_games_played: number
          winner_id?: string | null
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          final_score_p1?: number
          final_score_p2?: number
          game_categories?: string[] | null
          games_breakdown?: Json | null
          handicaps_used?: Json | null
          id?: string
          items_used?: string[] | null
          performance_metrics?: Json | null
          player1_id?: string
          player2_id?: string
          punishment_completed?: boolean | null
          session_duration?: number | null
          session_id?: string
          total_games_played?: number
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_history_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          alternative_1: string | null
          alternative_2: string | null
          alternative_3: string | null
          availability_score: string
          created_at: string | null
          icon: string | null
          id: string
          is_featured: boolean
          material: string
          updated_at: string | null
        }
        Insert: {
          alternative_1?: string | null
          alternative_2?: string | null
          alternative_3?: string | null
          availability_score: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean
          material: string
          updated_at?: string | null
        }
        Update: {
          alternative_1?: string | null
          alternative_2?: string | null
          alternative_3?: string | null
          availability_score?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean
          material?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          name: string
          total_games_played: number | null
          total_losses: number | null
          total_wins: number | null
          updated_at: string | null
          win_rate: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          name: string
          total_games_played?: number | null
          total_losses?: number | null
          total_wins?: number | null
          updated_at?: string | null
          win_rate?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          name?: string
          total_games_played?: number | null
          total_losses?: number | null
          total_wins?: number | null
          updated_at?: string | null
          win_rate?: number | null
        }
        Relationships: []
      }
      user_materials: {
        Row: {
          created_at: string | null
          id: string
          material_id: string
          quantity_available: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          material_id: string
          quantity_available?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          material_id?: string
          quantity_available?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      punishments: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          difficulty: string | null
          duration_seconds: number | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number | null
          created_at: string | null
          id: string
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action: string
          count?: number | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action?: string
          count?: number | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "player_detailed_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "secure_player_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      // Views omitted for brevity - they are read-only computed views
    }
    Functions: {
      // Functions omitted for brevity
    }
    Enums: {
      session_phase:
        | "player_selection"
        | "punishment_selection"
        | "item_gathering"
        | "game_instructions"
        | "gameplay"
        | "scoring"
        | "handicap"
        | "game_complete"
        | "session_complete"
      session_status: "active" | "completed" | "abandoned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
