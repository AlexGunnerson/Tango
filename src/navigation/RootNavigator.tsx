import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, Modal, View, Pressable, StyleSheet, Image } from 'react-native';
import { RootStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';
// import DevNavigator from '../components/DevNavigator';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import GameLibraryScreen from '../screens/GameLibraryScreen';
import PlayerSelectionScreen from '../screens/TangoFlow/PlayerSelectionScreen';
import PunishmentSelectionScreen from '../screens/TangoFlow/PunishmentSelectionScreen';
import ItemGatheringScreen from '../screens/TangoFlow/ItemGatheringScreen';
import GameInstructionsScreen from '../screens/TangoFlow/GameInstructionsScreen';
import GameplayScreen from '../screens/TangoFlow/GameplayScreen';
import ScoringScreen from '../screens/TangoFlow/ScoringScreen';
import WinnerScreen from '../screens/TangoFlow/WinnerScreen';
import GameCompleteScreen from '../screens/TangoFlow/GameCompleteScreen';
import GameConclusionScreen from '../screens/TangoFlow/GameConclusionScreen';
import TimesUpScreen from '../screens/TangoFlow/TimesUpScreen';
import TeamSelectionScreen from '../screens/TeamSelectionScreen';
import TournamentSetupScreen from '../screens/TournamentSetupScreen';

// Game-specific screens
import GameInstructionsScreen1 from '../screens/TangoFlow/GameInstructionsScreen1';
import GameInstructionsScreen2 from '../screens/TangoFlow/GameInstructionsScreen2';
import GameInstructionsScreen3 from '../screens/TangoFlow/GameInstructionsScreen3';
import GameInstructionsScreen4 from '../screens/TangoFlow/GameInstructionsScreen4';
import GameInstructionsScreen5 from '../screens/TangoFlow/GameInstructionsScreen5';
import GameplayScreenGame1Player1 from '../screens/TangoFlow/GameplayScreenGame1Player1';
import GameplayScreenGame1Player2 from '../screens/TangoFlow/GameplayScreenGame1Player2';
import GameplayScreenGame2Player1 from '../screens/TangoFlow/GameplayScreenGame2Player1';
import GameplayScreenGame2Player2 from '../screens/TangoFlow/GameplayScreenGame2Player2';
import GameplayScreenGame3Player1 from '../screens/TangoFlow/GameplayScreenGame3Player1';
import GameplayScreenGame3Player2 from '../screens/TangoFlow/GameplayScreenGame3Player2';
import GameplayScreenGame4 from '../screens/TangoFlow/GameplayScreenGame4';
import GameplayScreenGame4Player1 from '../screens/TangoFlow/GameplayScreenGame4Player1';
import GameplayScreenGame4Player2 from '../screens/TangoFlow/GameplayScreenGame4Player2';
import GameplayScreenGame5Player1 from '../screens/TangoFlow/GameplayScreenGame5Player1';
import GameplayScreenGame5Player2 from '../screens/TangoFlow/GameplayScreenGame5Player2';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Menu Modal Component
const MenuModal = ({ visible, onClose, navigation, user }: { visible: boolean; onClose: () => void; navigation: any; user: any }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable style={menuStyles.modalBackdrop} onPress={onClose}>
      <Pressable style={menuStyles.menuCard} onPress={(e) => e.stopPropagation()}>
        {/* Profile Option - Always show but with different states */}
        <TouchableOpacity 
          style={menuStyles.menuProfileOption}
          onPress={() => {
            onClose();
            if (user) {
              navigation.navigate('Profile');
            } else {
              navigation.navigate('Auth');
            }
          }}
        >
          <View style={menuStyles.menuProfileContent}>
            {user ? (
              <Image 
                source={{ uri: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'User')}&background=F66D3D&color=fff&size=40` }}
                style={menuStyles.menuProfileImage}
              />
            ) : (
              <View style={menuStyles.menuProfilePlaceholder}>
                <Text style={menuStyles.menuProfilePlaceholderText}>👤</Text>
              </View>
            )}
            <View style={menuStyles.menuProfileTextContainer}>
              <Text style={menuStyles.menuProfileName}>
                {user ? (user.user_metadata?.full_name || user.user_metadata?.username || 'User') : 'Sign in'}
              </Text>
              {user && (
                <Text style={menuStyles.menuProfileSubtext}>View Profile</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={menuStyles.menuOption}
          onPress={() => {
            onClose();
            // Navigate to Home screen to end the current game
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
  const { user, loading } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigationRef = useRef<any>(null);
  
  const showMenu = () => setIsMenuVisible(true);
  const hideMenu = () => setIsMenuVisible(false);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </NavigationContainer>
    );
  }
  
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Auth"}
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
        {/* Authentication screens */}
        {!user && (
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen}
            options={{ 
              title: 'Welcome',
              headerShown: false
            }}
          />
        )}

        {/* Profile screen - only for authenticated users */}
        {user && (
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        )}
        
        {/* Main screens - accessible to all users */}
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
          name="Winner" 
          component={WinnerScreen}
          options={{ 
            title: '',
            headerShown: false, // Hide header for full-screen celebration
            headerLeft: () => null, // Prevent going back
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="GameComplete" 
          component={GameCompleteScreen}
          options={{ 
            title: '',
            headerShown: false, // Hide header for clean final screen
            headerLeft: () => null, // Prevent going back
            gestureEnabled: false,
          }}
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

        {/* Game-specific instruction screens */}
        <Stack.Screen 
          name="GameInstructionsScreen1" 
          component={GameInstructionsScreen1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameInstructionsScreen2" 
          component={GameInstructionsScreen2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameInstructionsScreen3" 
          component={GameInstructionsScreen3}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameInstructionsScreen4" 
          component={GameInstructionsScreen4}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameInstructionsScreen5" 
          component={GameInstructionsScreen5}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />

        {/* Game-specific gameplay screens */}
        <Stack.Screen 
          name="GameplayScreenGame1Player1" 
          component={GameplayScreenGame1Player1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame1Player2" 
          component={GameplayScreenGame1Player2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame2Player1" 
          component={GameplayScreenGame2Player1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame2Player2" 
          component={GameplayScreenGame2Player2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame3Player1" 
          component={GameplayScreenGame3Player1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame3Player2" 
          component={GameplayScreenGame3Player2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame4" 
          component={GameplayScreenGame4}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame4Player1" 
          component={GameplayScreenGame4Player1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame4Player2" 
          component={GameplayScreenGame4Player2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame5Player1" 
          component={GameplayScreenGame5Player1}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
        <Stack.Screen 
          name="GameplayScreenGame5Player2" 
          component={GameplayScreenGame5Player2}
          options={({ navigation }) => ({ 
            title: '',
            headerBackTitle: 'Back',
            headerRight: createHomeButton(navigation, showMenu)
          })}
        />
      </Stack.Navigator>
      
      <MenuModal 
        visible={isMenuVisible} 
        onClose={hideMenu} 
        navigation={navigationRef.current}
        user={user}
      />
      
      {/* Development Navigator - Disabled */}
      {/* <DevNavigator currentScreen={currentScreen} /> */}
    </NavigationContainer>
  );
}

const menuStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 100,
    paddingLeft: 20,
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
  menuOptionTextContainer: {
    flex: 1,
  },
  menuOptionSubtext: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Nunito',
    fontWeight: '400',
    marginTop: 2,
  },
  // Profile-specific menu styles
  menuProfileOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  menuProfilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuProfilePlaceholderText: {
    fontSize: 20,
    color: '#666666',
  },
  menuProfileTextContainer: {
    flex: 1,
  },
  menuProfileName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Nunito',
    fontWeight: '600',
  },
  menuProfileSubtext: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Nunito',
    fontWeight: '400',
    marginTop: 2,
  },

});
