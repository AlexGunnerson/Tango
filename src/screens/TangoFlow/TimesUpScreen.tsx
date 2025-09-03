import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'TimesUp'>;

export default function TimesUpScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, currentPlayer, nextPlayer } = route.params;

  return (
    <SafeAreaView style={styles.container}>
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
            // Navigate back to gameplay for next player
            navigation.navigate('Gameplay', {
              player1: nextPlayer, // Switch players
              player2: currentPlayer,
              punishment,
              availableItems,
              gameTitle
            });
          }}
        >
          <Text style={styles.tangoButtonText}>Tango!</Text>
        </TouchableOpacity>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{player1}: 2 | {player2}: 0</Text>
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
    width: 200,
    height: 200,
    borderRadius: 100,
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

});
