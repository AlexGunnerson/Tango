import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import screens (we'll create placeholder screens for now)
import HomeScreen from '../screens/HomeScreen';
import GameLibraryScreen from '../screens/GameLibraryScreen';
import PlayerSelectionScreen from '../screens/TangoFlow/PlayerSelectionScreen';
import PunishmentSelectionScreen from '../screens/TangoFlow/PunishmentSelectionScreen';
import ItemGatheringScreen from '../screens/TangoFlow/ItemGatheringScreen';
import GameInstructionsScreen from '../screens/TangoFlow/GameInstructionsScreen';
import GameplayScreen from '../screens/TangoFlow/GameplayScreen';
import ScoringScreen from '../screens/TangoFlow/ScoringScreen';
import GameConclusionScreen from '../screens/TangoFlow/GameConclusionScreen';
import TeamSelectionScreen from '../screens/TeamSelectionScreen';
import TournamentSetupScreen from '../screens/TournamentSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1', // Indigo color
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Main screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Tango!',
            headerShown: false // Hide header for home screen
          }}
        />
        <Stack.Screen 
          name="GameLibrary" 
          component={GameLibraryScreen}
          options={{ title: 'Game Library' }}
        />

        {/* 1v1 Tango Flow screens */}
        <Stack.Screen 
          name="PlayerSelection" 
          component={PlayerSelectionScreen}
          options={{ title: '1v1 Tango - Players' }}
        />
        <Stack.Screen 
          name="PunishmentSelection" 
          component={PunishmentSelectionScreen}
          options={{ title: '1v1 Tango - Punishment' }}
        />
        <Stack.Screen 
          name="ItemGathering" 
          component={ItemGatheringScreen}
          options={{ title: '1v1 Tango - Items' }}
        />
        <Stack.Screen 
          name="GameInstructions" 
          component={GameInstructionsScreen}
          options={{ title: 'Game Instructions' }}
        />
        <Stack.Screen 
          name="Gameplay" 
          component={GameplayScreen}
          options={{ 
            title: 'Playing...',
            headerShown: false // Hide header during gameplay
          }}
        />
        <Stack.Screen 
          name="Scoring" 
          component={ScoringScreen}
          options={{ title: 'Round Results' }}
        />
        <Stack.Screen 
          name="GameConclusion" 
          component={GameConclusionScreen}
          options={{ 
            title: 'Game Complete!',
            headerLeft: () => null, // Prevent going back
            gestureEnabled: false,
          }}
        />

        {/* Other game mode screens */}
        <Stack.Screen 
          name="TeamSelection" 
          component={TeamSelectionScreen}
          options={{ title: 'Select Teams' }}
        />
        <Stack.Screen 
          name="TournamentSetup" 
          component={TournamentSetupScreen}
          options={{ title: 'Tournament Setup' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
