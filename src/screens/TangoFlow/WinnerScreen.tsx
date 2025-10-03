import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Animated, Modal, Pressable, ScrollView } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';
import { useGameSounds } from '../../hooks/useGameSounds';

type Props = RootStackScreenProps<'Winner'>;

export default function WinnerScreen({ navigation, route }: Props) {
  const { winner, finalPlayer1Score, finalPlayer2Score, player1Name, player2Name, punishment } = route.params;
  
  // Animation refs for confetti
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const confettiScale = useRef(new Animated.Value(0.5)).current;
  
  // Modal state
  const [isPunishmentModalVisible, setIsPunishmentModalVisible] = useState(false);

  // Sound effects
  const { playWinner } = useGameSounds();

  useEffect(() => {
    // Play winner sound and start confetti animation
    playWinner();
    
    // Start confetti animation immediately when screen loads
    const confettiAnimation = Animated.parallel([
      Animated.timing(confettiOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(confettiScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    confettiAnimation.start();

    return () => {
      confettiAnimation.stop();
    };
  }, [confettiOpacity, confettiScale, playWinner]);

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleClosePunishmentModal = () => {
    setIsPunishmentModalVisible(false);
    // Navigate to the final game complete screen
    navigation.navigate('GameComplete', {
      winner,
      finalPlayer1Score,
      finalPlayer2Score,
      player1Name,
      player2Name
    });
  };

  // Get punishment content based on selected punishment
  const getPunishmentContent = () => {
    const loser = winner === player1Name ? player2Name : player1Name;
    
    switch (punishment) {
      case 'The Human Butler':
        return {
          title: 'The Human Butler',
          content: `Alright ${loser}, time to serve! You are now the official human butler for the next 10 minutes.\n\nYour duties include:\n• Fetch snacks or drinks for ${winner}\n• Respond with "Yes, your majesty" to any request\n• Bow slightly when serving\n• Ask "${winner}, is there anything else I can get for you?"\n\nEmbrace your temporary servitude with grace and dignity!`
        };
      case 'The Dramatic Defeat':
        return {
          title: 'The Dramatic Defeat',
          content: `Time for your dramatic finale, ${loser}!\n\nYour performance requirements:\n• Lie on the floor dramatically\n• Stick your tongue out (like you've been defeated)\n• Hold this pose for 30 full seconds\n• Optional: Add dramatic sighs and "Oh, the humanity!" exclamations\n• ${winner} gets to judge your performance\n\nMake it theatrical! This is your moment to shine in defeat!`
        };
      case 'Concession Speech':
        return {
          title: 'Concession Speech',
          content: `Well, folks, here we are. I stand before you, a shell of the person I was just five minutes ago. I came here tonight to play, to compete, to conquer. But instead, I witnessed a master at work. The way ${winner} maneuvered that blindfold, the way they scooped those marshmallows with the grace of a gazelle... it wasn't a game, it was a ballet. A beautiful, devastating ballet.\n\nI'm not even mad. How can you be mad at perfection? I've learned more about myself tonight than in my entire life, and that lesson is: I am not worthy. I concede. All hail the new champion, ${winner}! May your reign be glorious and your victories forever unmatched.\n\n*Bow to the winner`
        };
      default:
        return {
          title: 'Victory Celebration',
          content: `Congratulations ${winner}! You are the champion!\n\nNo punishment was selected, so let's just celebrate this amazing victory. Well played!`
        };
    }
  };

  const punishmentContent = getPunishmentContent();


  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>WinnerScreen</Text>
        </View>
      )}
      <View style={styles.content}>
        {/* Animated Confetti Emojis */}
        <Animated.View 
          style={[
            styles.confettiContainer,
            {
              opacity: confettiOpacity,
              transform: [{ scale: confettiScale }]
            }
          ]}
        >
          <Text style={styles.confettiEmoji}>🎉</Text>
          <Text style={styles.confettiEmoji}>🥳</Text>
          <Text style={styles.confettiEmoji}>🎁</Text>
        </Animated.View>

        {/* Winner Text */}
        <Text style={styles.winnerText}>WINNER!</Text>

        {/* Winner Icon and Name */}
        <View style={styles.winnerSection}>
          <View style={styles.winnerIcon}>
            <Image 
              source={require('../../../assets/icon-person-white.png')} 
              style={styles.winnerIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.winnerName}>{winner}</Text>
        </View>

        {/* Punishment Section */}
        {punishment && punishment !== 'No Punishment' && (
          <TouchableOpacity 
            style={styles.punishmentSection}
            onPress={() => setIsPunishmentModalVisible(true)}
          >
            <Text style={styles.punishmentEmoji}>😱</Text>
            <Text style={styles.punishmentText}>
              {(winner === player1Name ? player2Name : player1Name)}'s Punishment
            </Text>
            <Text style={styles.punishmentEmoji}>😱</Text>
          </TouchableOpacity>
        )}

        {/* Home and Play Again Buttons - shown when no punishment */}
        {(!punishment || punishment === 'No Punishment') && (
          <View style={styles.noPunishmentButtonsContainer}>
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Image 
                source={require('../../../assets/home-icon-white.png')} 
                style={styles.homeButtonIcon}
                resizeMode="contain"
              />
              <Text style={styles.homeButtonText}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playAgainButton}
              onPress={() => {
                // Navigate back to ItemGathering to restart with same players but reset scores
                navigation.navigate('ItemGathering', {
                  player1: player1Name,
                  player2: player2Name,
                  punishment: undefined,
                  originalPlayer1: player1Name,
                  originalPlayer2: player2Name,
                  player1Score: 0,
                  player2Score: 0
                });
              }}
            >
              <Image 
                source={require('../../../assets/repeat-icon.png')} 
                style={styles.playAgainButtonIcon}
                resizeMode="contain"
              />
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Final Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>
            {player1Name}: {finalPlayer1Score} | {player2Name}: {finalPlayer2Score}
          </Text>
        </View>
      </View>

      {/* Punishment Modal */}
      <Modal
        visible={isPunishmentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClosePunishmentModal}
      >
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={handleClosePunishmentModal}
        >
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{punishmentContent.title}</Text>
            
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalContent}>
                {punishmentContent.content}
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleClosePunishmentModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confettiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 200,
    marginBottom: 10,
    marginTop: 60,
  },
  confettiEmoji: {
    fontSize: 60,
    marginHorizontal: 3,
    marginRight: 5
  },
  winnerText: {
    fontSize: 42,
    fontWeight: 'semibold',
    color: '#333333',
    fontFamily: 'Nunito',
    marginBottom: 18,
    marginLeft: 14,
    textAlign: 'center',
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  winnerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  winnerIconImage: {
    width: 40,
    height: 40,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  punishmentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 60,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  punishmentEmoji: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  punishmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
    flex: 1,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 475,
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    fontFamily: 'Nunito',
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
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
  // No Punishment Buttons Styles
  noPunishmentButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    gap: 20,
  },
  homeButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  homeButtonIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
  },
  playAgainButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainButtonIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
  },
});
