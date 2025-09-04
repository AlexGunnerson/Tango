import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Root Stack Navigator parameter list
export type RootStackParamList = {
  Home: undefined;
  GameLibrary: undefined;
  // 1v1 Tango Flow screens
  PlayerSelection: undefined;
  PunishmentSelection: { player1: string; player2: string };
  ItemGathering: { 
    player1: string; 
    player2: string; 
    punishment?: string;
    originalPlayer1?: string;
    originalPlayer2?: string;
    player1Score?: number;
    player2Score?: number;
  };
  GameInstructions: { 
    player1: string; 
    player2: string; 
    punishment?: string;
    availableItems: any[];
    originalPlayer1?: string;
    originalPlayer2?: string;
    player1Score?: number;
    player2Score?: number;
  };
  Gameplay: { 
    player1: string; 
    player2: string; 
    punishment?: string;
    availableItems: any[];
    gameTitle?: string;
    isSecondPlayerTurn?: boolean;
    originalPlayer1?: string;
    originalPlayer2?: string;
    player1Score?: number;
    player2Score?: number;
  };
  TimesUp: {
    player1: string; 
    player2: string; 
    punishment?: string;
    availableItems: any[];
    gameTitle?: string;
    currentPlayer: string;
    nextPlayer: string;
    originalPlayer1?: string;
    originalPlayer2?: string;
    player1Score?: number;
    player2Score?: number;
  };
  Scoring: { 
    player1: string; 
    player2: string; 
    punishment?: string;
    availableItems: any[];
    gameTitle?: string;
    originalPlayer1?: string;
    originalPlayer2?: string;
    player1Score?: number;
    player2Score?: number;
  };
  Winner: {
    winner: string;
    finalPlayer1Score: number;
    finalPlayer2Score: number;
    player1Name: string;
    player2Name: string;
    punishment?: string;
  };
  GameComplete: {
    winner: string;
    finalPlayer1Score: number;
    finalPlayer2Score: number;
    player1Name: string;
    player2Name: string;
  };
  GameConclusion: { 
    sessionData: any;
  };
  // Other game modes (to be implemented later)
  TeamSelection: { mode: '2v2' | 'coop' };
  TournamentSetup: undefined;
};

// Screen props type helper
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// Navigation prop type helper  
export type NavigationProp = RootStackScreenProps<keyof RootStackParamList>['navigation'];

// Route prop type helper
export type RouteProp<T extends keyof RootStackParamList> = 
  RootStackScreenProps<T>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
