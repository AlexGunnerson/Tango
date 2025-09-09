import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'TimesUp'>;

export default function TimesUpScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, currentPlayer, nextPlayer, originalPlayer1, originalPlayer2, player1Score, player2Score } = route.params;
  const [isHandicapModalVisible, setIsHandicapModalVisible] = useState(false);
  
  // Determine current game number based on total games played
  const totalGamesPlayed = (player1Score || 0) + (player2Score || 0);
  const currentGameNumber = totalGamesPlayed + 1;
  
  // Check if the next player (Player 2) has a 2-game advantage (handicap condition)
  const currentPlayer1Score = player1Score || 0;
  const currentPlayer2Score = player2Score || 0;
  const scoreDifference = Math.abs(currentPlayer1Score - currentPlayer2Score);
  const hasHandicap = scoreDifference >= 2;
  
  // Determine which player is ahead and gets the handicap
  const leadingPlayer = currentPlayer1Score > currentPlayer2Score ? player1 : player2;
  const displayPlayer1 = originalPlayer1 || player1;
  const displayPlayer2 = originalPlayer2 || player2;
  const leadingDisplayPlayer = currentPlayer1Score > currentPlayer2Score ? displayPlayer1 : displayPlayer2;
  
  // Check if the next player (who is about to play) is the one who should get the handicap
  const nextPlayerGetsHandicap = hasHandicap && (nextPlayer === leadingPlayer);
  
  // Game-specific configuration
  const currentGameTitle = gameTitle || 'The Blind March';
  const gameConfig = {
    'The Blind March': {
      playerAction: 'march',
      readyAction: 'March',
      timesUpInstruction: 'Mark the spot',
      handicapDescription: 'At 45 seconds, {player} must do a full 360 degree turn without changing the speed of marching.'
    },
    'Marshmallow Scoop': {
      playerAction: 'scoop',
      readyAction: 'Scoop',
      timesUpInstruction: 'Count your marshmallows',
      handicapDescription: 'At 15 seconds, {player} must switch to using their non-dominant hand for scooping.'
    },
    'Paper Plate Snowman': {
      playerAction: 'draw',
      readyAction: 'Draw',
      timesUpInstruction: 'Show your drawing',
      handicapDescription: 'At 15 seconds, {player} must switch the paper plate to their non-dominant hand.'
    },
    'Tearable Tree': {
      playerAction: 'tear',
      readyAction: 'Tear',
      timesUpInstruction: 'Show your tree',
      handicapDescription: 'At 15 seconds, {player} must close their eyes while continuing to tear.'
    }
  };
  
  const config = gameConfig[currentGameTitle] || gameConfig['The Blind March'];
  
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
        <Text style={styles.gameTitle}>{currentGameTitle}</Text>
        
        {/* Times Up Message */}
        <Text style={styles.timesUpTitle}>Times Up!</Text>
        
        {/* Instructions */}
        <Text style={styles.instructionsText}>
          {config.timesUpInstruction}. {nextPlayer} get ready to {config.playerAction}!
        </Text>
        
        {/* Ready Message */}
        <Text style={styles.readyText}>
          Ready <Text style={styles.playerName}>{nextPlayer}</Text>?
        </Text>
        
        {/* Tango Button */}
        <TouchableOpacity 
          style={styles.tangoButton}
          onPress={() => {
            if (nextPlayerGetsHandicap) {
              // Show handicap modal if the next player is the one who gets the handicap
              setIsHandicapModalVisible(true);
            } else {
              // Navigate directly to the correct GameplayScreenGame*Player2 for player 2's turn
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
            }
          }}
        >
          <Text style={styles.tangoButtonText}>Tango!</Text>
        </TouchableOpacity>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{originalPlayer1 || player1}: {player1Score || 0} | {originalPlayer2 || player2}: {player2Score || 0}</Text>
        </View>
      </View>

      {/* Handicap Modal */}
      <Modal
        visible={isHandicapModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHandicapModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsHandicapModalVisible(false)}>
          <Pressable style={styles.handicapCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.handicapTitle}>Handicap for {leadingDisplayPlayer}!</Text>
            
            <Text style={styles.handicapDescription}>
              {config.handicapDescription.replace('{player}', leadingDisplayPlayer)}
            </Text>

            <TouchableOpacity 
              style={styles.handicapTangoButton}
              onPress={() => {
                setIsHandicapModalVisible(false);
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
              <Text style={styles.handicapTangoButtonText}>Tango!</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  // Handicap Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handicapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  handicapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F66D3D',
    fontFamily: 'Nunito',
    textAlign: 'center',
    marginBottom: 20,
  },
  handicapDescription: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  handicapTangoButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  handicapTangoButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
  },
});
