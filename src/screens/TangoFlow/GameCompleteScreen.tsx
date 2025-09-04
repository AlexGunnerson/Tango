import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'GameComplete'>;

export default function GameCompleteScreen({ navigation, route }: Props) {
  const { winner, finalPlayer1Score, finalPlayer2Score, player1Name, player2Name } = route.params;

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handlePlayAgain = () => {
    // Navigate back to ItemGathering screen to restart the same game
    navigation.navigate('ItemGathering', {
      player1: player1Name,
      player2: player2Name,
      punishment: undefined, // Let them select punishment again
      originalPlayer1: player1Name,
      originalPlayer2: player2Name,
      player1Score: 0, // Reset scores for new game
      player2Score: 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tango Title in Header */}
      <View style={styles.header}>
        <Text style={styles.tangoTitle}>Tango</Text>
      </View>
      
      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleGoHome}
          >
            <View style={styles.buttonIcon}>
              <Image 
                source={require('../../../assets/home-icon-white.png')} 
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonText} numberOfLines={1}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePlayAgain}
          >
            <View style={styles.buttonIcon}>
              <Image 
                source={require('../../../assets/repeat-icon.png')} 
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonText} numberOfLines={1}>Play Again</Text>
          </TouchableOpacity>
        </View>

        {/* Final Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>
            {player1Name}: {finalPlayer1Score} | {player2Name}: {finalPlayer2Score}
          </Text>
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tangoTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 120,
  },
  actionButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginBottom: 12,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  scoreSection: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Nunito',
    fontWeight: '600',
    textAlign: 'center',
  },
});
