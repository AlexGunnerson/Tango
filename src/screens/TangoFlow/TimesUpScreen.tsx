import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'TimesUp'>;

export default function TimesUpScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, currentPlayer, nextPlayer, originalPlayer1, originalPlayer2, player1Score, player2Score } = route.params;
  
  // Determine current game number based on total games played
  const totalGamesPlayed = (player1Score || 0) + (player2Score || 0);
  const currentGameNumber = totalGamesPlayed + 1;
  
  // Get the correct GameplayScreen for Player2 based on current game
  const getGameplayScreenPlayer2 = (gameNumber: number) => {
    switch (gameNumber) {
      case 1: return 'GameplayScreenGame1Player2';
      case 2: return 'GameplayScreenGame2Player2';
      case 3: return 'GameplayScreenGame3Player2';
      case 4: return 'GameplayScreenGame4Player2';
      case 5: return 'GameplayScreenGame5Player2';
      default: return 'GameplayScreenGame1Player2'; // Fallback
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>TimesUpScreen</Text>
        </View>
      )}
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>{gameTitle || 'The Blind March'}</Text>
        
        {/* Times Up Message */}
        <Text style={styles.timesUpTitle}>Times Up!</Text>
        
        {/* Instructions */}
        <Text style={styles.instructionsText}>
          Mark the spot. {nextPlayer} get ready to march!
        </Text>
        
        {/* Ready Message */}
        <Text style={styles.readyText}>
          Ready <Text style={styles.playerName}>{nextPlayer}</Text>?
        </Text>
        
        {/* Tango Button */}
        <TouchableOpacity 
          style={styles.tangoButton}
          onPress={() => {
            // Navigate to the correct GameplayScreenGame*Player2 for player 2's turn
            const targetScreen = getGameplayScreenPlayer2(currentGameNumber);
            navigation.navigate(targetScreen as any, {
              player1,
              player2,
              punishment,
              availableItems,
              gameTitle,
              originalPlayer1,
              originalPlayer2,
              player1Score,
              player2Score
            });
          }}
        >
          <Text style={styles.tangoButtonText}>Tango!</Text>
        </TouchableOpacity>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{originalPlayer1 || player1}: {player1Score || 0} | {originalPlayer2 || player2}: {player2Score || 0}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
    fontFamily: 'Nunito',
  },
  timesUpTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  instructionsText: {
    fontSize: 24,
    color: '#333333',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 40,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
  },
  readyText: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 60,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
  },
  playerName: {
    fontWeight: 'bold',
  },
  tangoButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tangoButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
  },
  scoreSection: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
    fontWeight: '500',
  },
  // DEV: Screen indicator styles
  devScreenIndicator: {
    position: 'absolute',
    top: 90,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  devScreenText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Courier',
  },
});
