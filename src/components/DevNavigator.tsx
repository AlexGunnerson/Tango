import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../navigation/types';

// Only show in development
const __DEV__ = process.env.NODE_ENV === 'development';

interface DevNavigatorProps {
  currentScreen?: string;
}

export default function DevNavigator({ currentScreen }: DevNavigatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // Don't render in production
  if (!__DEV__) {
    return null;
  }

  const screens = [
    { name: 'Home', displayName: 'Home', params: undefined },
    { name: 'ItemGathering', displayName: 'ItemGathering', params: { 
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'The Human Butler',
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 0,
      player2Score: 0
    }},
    { name: 'GameInstructions', displayName: 'GameInstructions (0-0)', params: { 
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'The Dramatic Defeat',
      availableItems: [
        { id: 1, name: 'Spatula', selected: true },
        { id: 2, name: 'Paper Plate', selected: true },
        { id: 3, name: 'Marshmallows', selected: true }
      ],
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 0,
      player2Score: 0
    }},
    { name: 'GameInstructions', displayName: 'GameInstructions (2-0 Handicap)', params: { 
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'The Human Butler',
      availableItems: [
        { id: 1, name: 'Spatula', selected: true },
        { id: 2, name: 'Paper Plate', selected: true }
      ],
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 2,
      player2Score: 0
    }},
    { name: 'Gameplay', displayName: 'Gameplay', params: { 
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'Concession Speech',
      availableItems: [
        { id: 1, name: 'Spatula', selected: true },
        { id: 2, name: 'Paper Plate', selected: true }
      ],
      gameTitle: 'The Blind March',
      isSecondPlayerTurn: false,
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 2,
      player2Score: 1
    }},
    { name: 'TimesUp', displayName: 'TimesUp', params: {
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'The Human Butler',
      availableItems: [],
      gameTitle: 'The Blind March',
      currentPlayer: 'Alex',
      nextPlayer: 'Rachel',
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 2,
      player2Score: 1
    }},
    { name: 'Scoring', displayName: 'Scoring', params: { 
      player1: 'Alex', 
      player2: 'Rachel', 
      punishment: 'The Dramatic Defeat',
      availableItems: [],
      gameTitle: 'The Blind March',
      originalPlayer1: 'Alex',
      originalPlayer2: 'Rachel',
      player1Score: 2,
      player2Score: 2
    }},
    { name: 'Winner', displayName: 'Winner', params: {
      winner: 'Alex',
      finalPlayer1Score: 3,
      finalPlayer2Score: 2,
      player1Name: 'Alex',
      player2Name: 'Rachel',
      punishment: 'Concession Speech'
    }},
    { name: 'GameComplete', displayName: 'GameComplete', params: {
      winner: 'Rachel',
      finalPlayer1Score: 2,
      finalPlayer2Score: 3,
      player1Name: 'Alex',
      player2Name: 'Rachel'
    }}
  ];

  const handleNavigate = (screenName: string, params: any) => {
    setIsVisible(false);
    // Small delay to allow modal to close
    setTimeout(() => {
      navigation.navigate(screenName as any, params);
    }, 100);
  };

  return (
    <>
      {/* Floating Dev Button */}
      <TouchableOpacity
        style={styles.devButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.devButtonText}>🚀</Text>
      </TouchableOpacity>

      {/* Screen Navigator Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>🚀 Dev Navigator</Text>
            <Text style={styles.currentScreen}>Current: {currentScreen || 'Unknown'}</Text>
            
            <ScrollView style={styles.screenList} showsVerticalScrollIndicator={false}>
              {screens.map((screen, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.screenButton,
                    currentScreen === screen.name && styles.currentScreenButton
                  ]}
                  onPress={() => handleNavigate(screen.name, screen.params)}
                >
                  <Text style={[
                    styles.screenButtonText,
                    currentScreen === screen.name && styles.currentScreenButtonText
                  ]}>
                    {screen.displayName || screen.name}
                  </Text>
                  {screen.params && (
                    <Text style={styles.screenParams}>
                      {screen.params.player1 ? `${screen.params.player1} vs ${screen.params.player2}` : 'With params'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  devButtonText: {
    fontSize: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  currentScreen: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  screenList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  screenButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currentScreenButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  screenButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  currentScreenButtonText: {
    color: '#FFFFFF',
  },
  screenParams: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
