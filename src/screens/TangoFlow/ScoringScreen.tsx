import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';
import { useGameSounds } from '../../hooks/useGameSounds';
import { useGameLogic } from '../../hooks/useGameLogic';
import { supabaseService } from '../../services/supabaseService';
import { Game } from '../../types/game';

type Props = RootStackScreenProps<'Scoring'>;

export default function ScoringScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems, gameTitle, originalPlayer1, originalPlayer2, player1Score: initialPlayer1Score, player2Score: initialPlayer2Score } = route.params;
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch game data from Supabase
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setIsLoading(true);
        const game = await supabaseService.getGameByTitle(gameTitle || 'The Blind March');
        setGameData(game);
      } catch (error) {
        console.error('🎮 ScoringScreen - Error fetching game data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [gameTitle]);

  // Game logic integration
  const { sessionState, completeRound, isGameComplete, winner, getNextGameInstructions, service, createSession, setPlayers } = useGameLogic();
  
  // Session initialization fallback
  useEffect(() => {
    // Initialize session if it doesn't exist
    if (!sessionState && !service.getSession()) {
      const newSession = createSession('1v1');
      if (newSession) {
        setPlayers(displayPlayer1, displayPlayer2);
      }
    }
  }, []);
  
  // Use game logic service state for scores, fallback to route params for backward compatibility
  const player1Score = sessionState?.player1?.score ?? initialPlayer1Score ?? 0;
  const player2Score = sessionState?.player2?.score ?? initialPlayer2Score ?? 0;

  // Use original player names for consistent display
  const displayPlayer1 = originalPlayer1 || player1;
  const displayPlayer2 = originalPlayer2 || player2;

  // Calculate preview scores based on selection
  const previewPlayer1Score = selectedWinner === displayPlayer1 ? player1Score + 1 : player1Score;
  const previewPlayer2Score = selectedWinner === displayPlayer2 ? player2Score + 1 : player2Score;

  // Sound effects
  const { playButtonClick } = useGameSounds();

  const handleWinnerSelect = (winner: string) => {
    playButtonClick(); // Play sound when winner is selected
    setSelectedWinner(winner);
  };

  const getNextGameInstructionsScreen = (p1Score: number, p2Score: number) => {
    const totalGamesPlayed = p1Score + p2Score;
    
    switch (totalGamesPlayed) {
      case 1:
        return 'GameInstructionsScreen2';
      case 2:
        return 'GameInstructionsScreen3';
      case 3:
        return 'GameInstructionsScreen4';
      case 4:
        return 'GameInstructionsScreen5';
      default:
        return 'GameInstructionsScreen1'; // Fallback, shouldn't happen
    }
  };

  const handleNextGame = async () => {
    if (!selectedWinner) return;
    
    // Determine winner ID for game logic service
    const winnerId = selectedWinner === displayPlayer1 ? 'player1' : 'player2';
    
    try {
      // Complete the round in the game logic service - this will update scores and sync to database
      await completeRound(winnerId);
      
      // Check if game is complete by accessing the service directly to avoid async state issues
      const gameIsComplete = service.isGameComplete();
      
      if (gameIsComplete) {
        // Game is complete, navigate to winner screen
        setTimeout(() => {
          // Get the final scores directly from the service for accuracy
          const currentSession = service.getSession();
          navigation.navigate('Winner', {
            winner: selectedWinner,
            finalPlayer1Score: currentSession?.player1?.score ?? 0,
            finalPlayer2Score: currentSession?.player2?.score ?? 0,
            player1Name: displayPlayer1,
            player2Name: displayPlayer2,
            punishment
          });
        }, 300);
      } else {
        // Only allow next game if no one has reached 3 wins yet
        if (player1Score < 3 && player2Score < 3) {
          // Use game logic service to get the next screen
          const nextScreen = getNextGameInstructions();
          
          navigation.navigate(nextScreen as any, {
            player1,
            player2,
            punishment,
            availableItems,
            originalPlayer1,
            originalPlayer2,
            player1Score: sessionState?.player1?.score ?? 0,
            player2Score: sessionState?.player2?.score ?? 0
          });
        }
      }
    } catch (error) {
      console.error('Error completing round:', error);
      // Fallback to local state management if service fails
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>ScoringScreen</Text>
        </View>
      )}
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>
          {isLoading ? 'Loading...' : (gameData?.title || gameTitle || 'The Blind March')}
        </Text>
        
        {/* Times Up Message */}
        <Text style={styles.timesUpTitle}>Times Up!</Text>
        
        {/* Select Winner Section */}
        <Text style={styles.selectWinnerTitle}>Select the Winner</Text>
        
        {/* Winner Selection Buttons */}
        <View style={styles.winnersContainer}>
          <TouchableOpacity 
            style={[
              styles.winnerButton,
              selectedWinner === displayPlayer1 && styles.winnerButtonSelected
            ]}
            onPress={() => handleWinnerSelect(displayPlayer1)}
          >
            <View style={[
              styles.winnerIcon,
              selectedWinner === displayPlayer1 && styles.winnerIconSelected
            ]}>
              <Image 
                source={require('../../../assets/icon-person-white.png')} 
                style={styles.winnerIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.winnerName}>
              <Text style={styles.winnerNameText}>{displayPlayer1}: </Text>
              <Text style={styles.winnerScoreText}>{previewPlayer1Score}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.winnerButton,
              selectedWinner === displayPlayer2 && styles.winnerButtonSelected
            ]}
            onPress={() => handleWinnerSelect(displayPlayer2)}
          >
            <View style={[
              styles.winnerIcon,
              selectedWinner === displayPlayer2 && styles.winnerIconSelected
            ]}>
              <Image 
                source={require('../../../assets/icon-person-white.png')} 
                style={styles.winnerIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.winnerName}>
              <Text style={styles.winnerNameText}>{displayPlayer2}: </Text>
              <Text style={styles.winnerScoreText}>{previewPlayer2Score}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Game Button - Hidden when game is complete */}
        {(player1Score < 3 && player2Score < 3) && (
          <TouchableOpacity 
            style={[
              styles.nextGameButton,
              selectedWinner && styles.nextGameButtonActive
            ]}
            onPress={handleNextGame}
            disabled={!selectedWinner}
          >
            <Text style={[
              styles.nextGameButtonText,
              selectedWinner && styles.nextGameButtonTextActive
            ]}>Next Game!</Text>
          </TouchableOpacity>
        )}

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{displayPlayer1}: {player1Score} | {displayPlayer2}: {player2Score}</Text>
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
    textAlign: 'center',
  },
  timesUpTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 24,
    color: '#333333',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 60,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
  },
  selectWinnerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    marginTop: 60,
    fontFamily: 'Nunito',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  winnersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 60,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  winnerButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  winnerButtonSelected: {
    // Add any selection styling if needed
  },
  winnerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  winnerIconSelected: {
    backgroundColor: '#F66D3D',
    shadowColor: '#F66D3D',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  winnerIconImage: {
    width: 48,
    height: 48,
    tintColor: '#FFFFFF',
  },
  winnerName: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  winnerNameText: {
    fontWeight: 'normal',
  },
  winnerScoreText: {
    fontWeight: 'bold',
  },
  nextGameButton: {
    width: 280,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextGameButtonActive: {
    backgroundColor: '#F66D3D',
  },
  nextGameButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    fontFamily: 'Nunito',
  },
  nextGameButtonTextActive: {
    color: '#FFFFFF',
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
    bottom: 10,
    right: 10,
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

