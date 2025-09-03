import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'Gameplay'>;

export default function GameplayScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle } = route.params;
  const [timeRemaining, setTimeRemaining] = useState(90); // 90 seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Navigate to times up screen when timer ends
            navigation.navigate('TimesUp', {
              player1,
              player2,
              punishment,
              availableItems,
              gameTitle,
              currentPlayer: player1,
              nextPlayer: player2
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, navigation, player1, player2, punishment, availableItems, gameTitle]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setTimeRemaining(90);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>{gameTitle || 'The Blind March'}</Text>
        
        {/* Player Name */}
        <Text style={styles.playerName}>{player1} March!</Text>
        
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
        
        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleRestart}
          >
            <Text style={styles.controlButtonText}>↺</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePlayPause}
          >
            <Text style={styles.controlButtonText}>{isRunning ? '||' : '▶'}</Text>
          </TouchableOpacity>
        </View>

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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    fontFamily: 'Nunito',
  },
  playerName: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 60,
    fontFamily: 'Nunito',
    fontWeight: '500',
  },
  timerContainer: {
    marginBottom: 60,
  },
  timerText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    gap: 20,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  controlButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
