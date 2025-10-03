import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';
import { useGameSounds } from '../../hooks/useGameSounds';

type Props = RootStackScreenProps<'GameplayScreenGame1Player1'>;

export default function GameplayScreenGame1Player1({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, originalPlayer1, originalPlayer2, player1Score, player2Score, timerDuration, playerAction, gameType, hasTimer } = route.params;
  const [timeLeft, setTimeLeft] = useState(timerDuration ?? 90); // Use dynamic timer duration from game config
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound effects
  const { playFiveSecondCountdown, playGameStart, playTimeUp, soundsLoaded } = useGameSounds();

  // Countdown logic - runs first when screen loads
  useEffect(() => {
    if (soundsLoaded && showCountdown && hasTimer !== false) {
      // Play countdown sound and start visual countdown
      playFiveSecondCountdown();
      
      countdownRef.current = setInterval(() => {
        setCountdownValue((prevCount) => {
          console.log('Countdown tick:', prevCount);
          if (prevCount <= 1) {
            // Clear the interval first to stop the countdown
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            setShowCountdown(false);
            setIsPlaying(true); // Auto-start the timer after countdown
            playGameStart(); // Play game start sound once
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else if (hasTimer === false) {
      // For games without timer, skip countdown and just play game start sound
      setShowCountdown(false);
      playGameStart();
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [soundsLoaded, hasTimer]); // Depend on both soundsLoaded and hasTimer

  // Timer logic - only run if game has timer
  useEffect(() => {
    if (hasTimer !== false && isPlaying && timeLeft > 0) {
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
  }, [isPlaying, timeLeft, hasTimer]);

  // Navigation logic when timer ends - only for games with timer
  useEffect(() => {
    if (hasTimer !== false && timeLeft === 0 && !isPlaying) {
      // Play time up sound
      playTimeUp();
      
      // For simultaneous games, skip TimesUp and Player2 screens, go directly to scoring
      setTimeout(() => {
        if (gameType === 'simultaneous') {
          navigation.navigate('Scoring', {
            player1,
            player2,
            punishment,
            availableItems,
            gameTitle: gameTitle,
            originalPlayer1: displayPlayer1,
            originalPlayer2: displayPlayer2,
            player1Score,
            player2Score
          });
        } else {
          // Player 1 finished, navigate to TimesUp screen for Player 2 to get ready
          navigation.navigate('TimesUp', {
            player1,
            player2,
            punishment,
            availableItems,
            gameTitle: gameTitle,
            currentPlayer: player1,
            nextPlayer: player2,
            originalPlayer1: displayPlayer1,
            originalPlayer2: displayPlayer2,
            player1Score,
            player2Score,
            playerAction
          });
        }
      }, 1000);
    }
  }, [timeLeft, isPlaying, playTimeUp]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setTimeLeft(timerDuration ?? 90); // Reset to dynamic timer duration
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
          <Text style={styles.devScreenText}>GameplayScreenGame1Player1</Text>
        </View>
      )}

      {/* Countdown Modal - only show for games with timer */}
      {hasTimer !== false && (
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
      )}
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>{gameTitle}</Text>
        
        {/* Player Name */}
        <Text style={styles.playerName}>
          {gameType === 'simultaneous' ? 
            `All players ${playerAction || 'Go!'}` : 
            `${player1} ${playerAction || 'Go!'}`
          }
        </Text>
        
        {/* Timer Display - only show for games with timer */}
        {hasTimer !== false && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        )}
        
        {/* Control Buttons - only show for games with timer */}
        {hasTimer !== false && (
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
        )}

        {/* Continue Button - only show for games without timer */}
        {hasTimer === false && (
          <TouchableOpacity 
            style={[styles.controlButton, styles.continueButton]}
            onPress={() => {
              // Navigate to next screen based on game type
              if (gameType === 'simultaneous') {
                navigation.navigate('Scoring', {
                  player1,
                  player2,
                  punishment,
                  availableItems,
                  gameTitle: gameTitle,
                  originalPlayer1: displayPlayer1,
                  originalPlayer2: displayPlayer2,
                  player1Score,
                  player2Score
                });
              } else {
                navigation.navigate('TimesUp', {
                  player1,
                  player2,
                  punishment,
                  availableItems,
                  gameTitle: gameTitle,
                  currentPlayer: player1,
                  nextPlayer: player2,
                  originalPlayer1: displayPlayer1,
                  originalPlayer2: displayPlayer2,
                  player1Score,
                  player2Score,
                  playerAction
                });
              }
            }}
          >
            <Text style={styles.controlButtonText}>Continue</Text>
          </TouchableOpacity>
        )}

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
    fontWeight: 'normal',
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
  continueButton: {
    width: 280,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
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
