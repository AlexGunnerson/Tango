import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'GameplayScreenGame2Player1'>;

export default function GameplayScreenGame2Player1({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, originalPlayer1, originalPlayer2, player1Score, player2Score } = route.params;
  
  // Game-specific configuration
  const currentGameTitle = gameTitle || 'Marshmallow Scoop';
  const gameConfig = {
    'The Blind March': {
      duration: 90,
      playerAction: 'March',
      testDuration: 3
    },
    'Marshmallow Scoop': {
      duration: 30,
      playerAction: 'Scoop',
      testDuration: 3
    }
  };
  
  const config = gameConfig[currentGameTitle] || gameConfig['Marshmallow Scoop'];
  const [timeLeft, setTimeLeft] = useState(config.testDuration); // Use test duration
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown logic - runs first when screen loads
  useEffect(() => {
    if (showCountdown && countdownValue > 0) {
      countdownRef.current = setInterval(() => {
        setCountdownValue((prevCount) => {
          if (prevCount <= 1) {
            setShowCountdown(false);
            setIsPlaying(true); // Auto-start the timer after countdown
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [showCountdown, countdownValue]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeLeft]);

  // Navigation logic when timer ends
  useEffect(() => {
    if (timeLeft === 0 && !isPlaying) {
      // Player 1 finished, navigate to TimesUp screen for Player 2 to get ready
      setTimeout(() => {
        navigation.navigate('TimesUp', {
          player1,
          player2,
          punishment,
          availableItems,
          gameTitle: currentGameTitle,
          currentPlayer: player1,
          nextPlayer: player2,
          originalPlayer1: displayPlayer1,
          originalPlayer2: displayPlayer2,
          player1Score,
          player2Score
        });
      }, 1000);
    }
  }, [timeLeft, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setTimeLeft(config.testDuration); // Reset to test duration
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayPlayer1 = originalPlayer1 || player1;
  const displayPlayer2 = originalPlayer2 || player2;

  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>GameplayScreenGame2Player1</Text>
        </View>
      )}

      {/* Countdown Modal */}
      <Modal
        visible={showCountdown}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.countdownModalBackdrop}>
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownNumber}>{countdownValue}</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>{currentGameTitle}</Text>
        
        {/* Player Name */}
        <Text style={styles.playerName}>{player1} {config.playerAction}!</Text>
        
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
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
            <Text style={styles.controlButtonText}>{isPlaying ? '||' : '▶'}</Text>
          </TouchableOpacity>
        </View>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{displayPlayer1}: {player1Score || 0} | {displayPlayer2}: {player2Score || 0}</Text>
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
    marginBottom: 30,
    fontFamily: 'Nunito',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 60,
    fontFamily: 'Nunito',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  timerText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    gap: 40,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  // Countdown Modal Styles
  countdownModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 200,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    textAlign: 'center',
    zIndex: 1000,
  },
});
