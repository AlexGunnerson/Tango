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
    punishment?: string 
  };
  GameInstructions: { 
    gameId: string;
    sessionData: any;
  };
  Gameplay: { 
    gameId: string;
    sessionData: any;
  };
  Scoring: { 
    gameId: string;
    sessionData: any;
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
