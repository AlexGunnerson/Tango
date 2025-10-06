import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'Gameplay'>;

export default function GameplayScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, isSecondPlayerTurn, originalPlayer1, originalPlayer2, player1Score, player2Score, hasTimer } = route.params;
  const [timeRemaining, setTimeRemaining] = useState(3); // 3 seconds for testing
  const [isRunning, setIsRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Navigation effect - separate from timer to avoid setState during render
  useEffect(() => {
    if (timeRemaining === 0 && !isRunning) {
      if (isSecondPlayerTurn) {
        // Both players have played, navigate to winner selection
        navigation.navigate('Scoring', {
          player1,
          player2,
          punishment,
          availableItems,
          gameTitle,
          originalPlayer1,
          originalPlayer2,
          player1Score,
          player2Score,
          hasTimer
        });
      } else {
        // First player finished, navigate to times up screen for second player
        navigation.navigate('TimesUp', {
          player1,
          player2,
          punishment,
          availableItems,
          gameTitle,
          currentPlayer: player1,
          nextPlayer: player2,
          originalPlayer1,
          originalPlayer2,
          player1Score,
          player2Score
        });
      }
    }
  }, [timeRemaining, isRunning, navigation, player1, player2, punishment, availableItems, gameTitle, isSecondPlayerTurn]);

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
    setTimeRemaining(3);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>{gameTitle}</Text>
        
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
          <Text style={styles.scoreText}>{originalPlayer1 || player1}: {player1Score || 2} | {originalPlayer2 || player2}: {player2Score || 0}</Text>
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
