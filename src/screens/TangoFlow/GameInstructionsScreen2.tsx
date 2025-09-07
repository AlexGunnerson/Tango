import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'GameInstructionsScreen2'>;

export default function GameInstructionsScreen2({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, originalPlayer1, originalPlayer2, player1Score, player2Score } = route.params;
  const [isHandicapModalVisible, setIsHandicapModalVisible] = useState(false);
  
  // Check if there's a 2-game advantage (handicap condition)
  const currentPlayer1Score = player1Score || 0;
  const currentPlayer2Score = player2Score || 0;
  const scoreDifference = Math.abs(currentPlayer1Score - currentPlayer2Score);
  const hasHandicap = scoreDifference >= 2;
  
  // Determine which player is ahead and gets the handicap
  const leadingPlayer = currentPlayer1Score > currentPlayer2Score ? player1 : player2;
  const displayPlayer1 = originalPlayer1 || player1;
  const displayPlayer2 = originalPlayer2 || player2;
  const leadingDisplayPlayer = currentPlayer1Score > currentPlayer2Score ? displayPlayer1 : displayPlayer2;

  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>GameInstructionsScreen2</Text>
        </View>
      )}
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>Marshmallow Scoop</Text>
        
        {/* How to Play Section */}
        <View style={styles.howToPlaySection}>
          <View style={styles.howToPlayHeader}>
            <Text style={styles.howToPlayText}>How to Play</Text>
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
          </View>
          
          <Text style={styles.instructionsText}>
            Blindfolded, scoop as many marshmallows into the bowl as possible in 30 seconds. The person with the most marshmallows in the bowl wins!
          </Text>
        </View>

        {/* Player Ready Section */}
        <View style={styles.playerReadySection}>
          <Text style={styles.playerReadyText}>
            <Text style={styles.playerName}>{player1}</Text> get ready, you're up first!
          </Text>
        </View>

        {/* Tango Button */}
        <TouchableOpacity 
          style={styles.tangoButton}
          onPress={() => {
            if (hasHandicap) {
              setIsHandicapModalVisible(true);
            } else {
              // Navigate to GameplayScreenGame2Player1
              navigation.navigate('GameplayScreenGame2Player1', {
                player1,
                player2,
                punishment,
                availableItems,
                gameTitle: 'Marshmallow Scoop',
                originalPlayer1,
                originalPlayer2,
                player1Score: currentPlayer1Score,
                player2Score: currentPlayer2Score
              });
            }
          }}
        >
          <Text style={styles.tangoButtonText}>Tango!</Text>
        </TouchableOpacity>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{originalPlayer1 || player1}: {currentPlayer1Score} | {originalPlayer2 || player2}: {currentPlayer2Score}</Text>
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
              At 15 seconds, {leadingDisplayPlayer} must switch to using their non-dominant hand for scooping.
            </Text>

            <TouchableOpacity 
              style={styles.handicapTangoButton}
              onPress={() => {
                setIsHandicapModalVisible(false);
                navigation.navigate('GameplayScreenGame2Player1', {
                  player1,
                  player2,
                  punishment,
                  availableItems,
                  gameTitle: 'Marshmallow Scoop',
                  originalPlayer1,
                  originalPlayer2,
                  player1Score: currentPlayer1Score,
                  player2Score: currentPlayer2Score
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
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    fontFamily: 'Nunito',
  },
  gameNumberSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameNumberText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F66D3D',
    fontFamily: 'Nunito',
  },
  howToPlaySection: {
    marginBottom: 40,
  },
  howToPlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  howToPlayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 12,
    fontFamily: 'Nunito',
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    fontFamily: 'Nunito',
  },
  playerReadySection: {
    marginBottom: 60,
  },
  playerReadyText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
  },
  playerName: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  handicapCard: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  handicapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Nunito',
  },
  handicapDescription: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Nunito',
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
