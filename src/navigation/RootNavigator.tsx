import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, Modal, View, Pressable, StyleSheet } from 'react-native';
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
import TimesUpScreen from '../screens/TangoFlow/TimesUpScreen';
import TeamSelectionScreen from '../screens/TeamSelectionScreen';
import TournamentSetupScreen from '../screens/TournamentSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Menu Modal Component
const MenuModal = ({ visible, onClose, navigation }: { visible: boolean; onClose: () => void; navigation: any }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable style={menuStyles.modalBackdrop} onPress={onClose}>
      <Pressable style={menuStyles.menuCard} onPress={(e) => e.stopPropagation()}>
        <TouchableOpacity 
          style={menuStyles.menuOption}
          onPress={() => {
            onClose();
            navigation.navigate('Home');
          }}
        >
          <View style={menuStyles.menuOptionContent}>
            <Text style={menuStyles.menuOptionIcon}>🏠</Text>
            <Text style={menuStyles.menuOptionText}>End Game</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={menuStyles.menuOption}
          onPress={() => {
            onClose();
            // TODO: Navigate to Settings screen when created
            console.log('Settings pressed');
          }}
        >
          <View style={menuStyles.menuOptionContent}>
            <Text style={menuStyles.menuOptionIcon}>⚙️</Text>
            <Text style={menuStyles.menuOptionText}>Settings</Text>
          </View>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

// Helper function to create the home button with modal
const createHomeButton = (navigation: any, showModal: () => void) => () => (
  <TouchableOpacity 
    onPress={showModal}
    style={{ padding: 8 }}
  >
    <Text style={{ fontSize: 20, color: '#000000', fontWeight: 'bold' }}>⋯</Text>
  </TouchableOpacity>
);

export default function RootNavigator() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigationRef = useRef<any>(null);
  
  const showMenu = () => setIsMenuVisible(true);
  const hideMenu = () => setIsMenuVisible(false);
  
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F5F5F5', // Same as main screen background
          },
          headerTintColor: '#000', // Black back button
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#333333',
          },
          headerShadowVisible: false, // Remove dividing line
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
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameInstructions" 
          component={GameInstructionsScreen}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="Gameplay" 
          component={GameplayScreen}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="TimesUp" 
          component={TimesUpScreen}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="Scoring" 
          component={ScoringScreen}
          options={({ navigation }) => ({ 
            title: 'Round Results',
            headerRight: createHomeButton(navigation, showMenu)
          })}
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
      
      <MenuModal 
        visible={isMenuVisible} 
        onClose={hideMenu} 
        navigation={navigationRef.current}
      />
    </NavigationContainer>
  );
}

const menuStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  menuOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 20,
  },
  menuOptionText: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Nunito',
    fontWeight: '400',
    flex: 1,
  },

});
