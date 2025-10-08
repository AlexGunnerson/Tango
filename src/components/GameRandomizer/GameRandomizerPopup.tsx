import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface GameCard {
  id: string;
  title: string;
  image?: any; // For game images if available
}

interface GameRandomizerPopupProps {
  visible: boolean;
  games: GameCard[];
  onComplete: (selectedGame: GameCard) => void;
  onClose?: () => void;
}

const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = height * 0.3;
const SIDE_CARD_WIDTH = width * 0.35;
const INITIAL_DELAY = 800; // Delay before cards start moving (ms)
const BASE_SHUFFLE_SPEED = 100; // Base speed of card shuffling (ms)
const POST_SELECTION_DELAY = 2000; // Delay after game is selected before navigation (ms)

export default function GameRandomizerPopup({
  visible,
  games,
  onComplete,
  onClose,
}: GameRandomizerPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameCard | null>(null);

  // Animation values
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && games.length > 0) {
      startRandomization();
    }
  }, [visible, games.length]);

  const startRandomization = () => {
    setIsAnimating(true);
    scrollPosition.setValue(0);
    nameOpacity.setValue(0); // Start with name invisible
    
    // Batch 1: Pre-calculate the winning game
    // Randomly select target game index
    const targetGameIndex = Math.floor(Math.random() * games.length);
    const chosenGame = games[targetGameIndex];
    
    // Calculate total scroll distance:
    // (3-4 full rotations * games.length) + targetGameIndex
    // NOTE: No extraOffset! We need scrollPosition to land exactly on targetGameIndex
    // For centering to work: cardIndex - scrollPosition = 0, so scrollPosition must equal targetGameIndex (mod games.length)
    const fullRotations = Math.floor(3 + Math.random()); // 3 or 4 full rotations
    const totalScrollDistance = (fullRotations * games.length) + targetGameIndex;
    
    // Log the calculated values
    console.log('🎯 Batch 1 - Pre-calculated values:');
    console.log('  Games array:', games.map((g, i) => `${i}: ${g.title}`));
    console.log('  Target game index:', targetGameIndex);
    console.log('  Chosen game:', chosenGame.title);
    console.log('  Full rotations:', fullRotations);
    console.log('  Total scroll distance:', totalScrollDistance);
    console.log('  Expected centered card:', targetGameIndex, '=', totalScrollDistance % games.length);
    
    // Fade in the popup
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Wait for initial delay before starting shuffle
    setTimeout(() => {
      // Batch 2: Single animation from 0 to totalScrollDistance
      console.log('🎬 Batch 2 - Starting single animation to:', totalScrollDistance);
      
      Animated.timing(scrollPosition, {
        toValue: totalScrollDistance,
        duration: 3000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // Batch 5: Animation complete - use pre-calculated chosenGame from Batch 1
        console.log('✅ Batch 5 - Animation complete at scrollPosition:', totalScrollDistance);
        console.log('🎯 Using pre-calculated game:', chosenGame.title, 'at index:', targetGameIndex);
        
        // DEBUG: Calculate which card should be centered based on the formula
        const centeredIndex = Math.round(totalScrollDistance) % games.length;
        console.log('🔍 DEBUG - Card that should be centered:');
        console.log('  Centered index (from math):', centeredIndex);
        console.log('  Centered game (from math):', games[centeredIndex].title);
        console.log('  Match?', centeredIndex === targetGameIndex ? '✅ YES' : '❌ NO - MISMATCH!');
        
        // Call debug helper to show all card positions
        debugCenteredCard(totalScrollDistance);
        
        setSelectedGame(chosenGame);
        
        // Show game name with fade in
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          console.log('✅ Game name faded in, waiting for navigation delay...');
          setIsAnimating(false);
          // Delay before navigating to next screen
          setTimeout(() => {
            console.log('⏰ Navigation delay complete, calling handleComplete with game:', chosenGame);
            handleComplete(chosenGame);
          }, POST_SELECTION_DELAY);
        });
      });
    }, INITIAL_DELAY);
  };

  const handleComplete = (game: GameCard) => {
    console.log('🎯 handleComplete called with game:', game);
    if (game) {
      console.log('✅ Game exists, starting fade out...');
      // Fade out animation
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nameOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log('🚀 Fade out complete, calling onComplete callback with game:', game);
        onComplete(game);
        // Reset for next time
        resetAnimations();
      });
    } else {
      console.log('❌ Game parameter is null/undefined, not navigating');
    }
  };

  const resetAnimations = () => {
    cardOpacity.setValue(0);
    nameOpacity.setValue(0);
    scrollPosition.setValue(0);
    setSelectedGame(null);
    setIsAnimating(false);
  };

  // Debug helper to check which card should be centered for a given scrollPosition
  const debugCenteredCard = (scrollPos: number) => {
    console.log('🔍 DEBUG - Testing each card position:');
    games.forEach((game, idx) => {
      const rawPos = idx - scrollPos;
      const wrapped = ((rawPos % games.length) + games.length) % games.length;
      const normalized = wrapped <= games.length / 2 ? wrapped : wrapped - games.length;
      const isCentered = Math.abs(normalized) < 0.1;
      console.log(`  Card ${idx} (${game.title}): rawPos=${rawPos.toFixed(2)}, wrapped=${wrapped.toFixed(2)}, normalized=${normalized.toFixed(2)} ${isCentered ? '🎯 CENTERED' : ''}`);
    });
  };

  const renderCard = (game: GameCard, cardIndex: number) => {
    // Card spacing - distance between cards
    const cardSpacing = width * 0.35;
    
    // Batch 3 & 4: Simplified position calculation using only cardIndex and scrollPosition
    // Calculate animated position: cardIndex - scrollPosition
    const animatedPosition = Animated.subtract(cardIndex, scrollPosition);
    
    // Use modulo to wrap position for circular carousel
    const wrappedPosition = Animated.modulo(
      Animated.add(animatedPosition, games.length * 100), // Add large offset to avoid negative numbers
      games.length
    );
    
    // Normalize to [-games.length/2, games.length/2] range for proper wrapping
    // For 5 items: wrapped [0,1,2,3,4] -> normalized [0,1,2,-2,-1]
    // Split at halfLength: [0, 2.5] stays positive, (2.5, 5) becomes negative
    const halfLength = games.length / 2;
    const normalizedPosition = wrappedPosition.interpolate({
      inputRange: [0, halfLength, halfLength + 0.001, games.length],
      outputRange: [0, halfLength, -games.length + halfLength + 0.001, 0],
      extrapolate: 'clamp',
    });
    
    // Interpolate translateX: cards move from right to left
    const translateX = Animated.multiply(normalizedPosition, cardSpacing);
    
    // Interpolate scale: center card (position 0) has scale 1.0, sides are smaller
    const animatedScale = normalizedPosition.interpolate({
      inputRange: [-2, -1, 0, 1, 2],
      outputRange: [0.7, 0.85, 1.0, 0.85, 0.7],
      extrapolate: 'clamp',
    });
    
    // Z-index: use cardIndex for stable layering
    const zIndex = cardIndex;

    return (
      <Animated.View
        key={`${game.id}-${cardIndex}`}
        style={[
          styles.gameCard,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transform: [
              { translateX },
              { scale: animatedScale },
            ],
            zIndex,
          },
        ]}
      >
        <View style={styles.cardBackground}>
          <View style={styles.cardContent}>
            {/* Game icon placeholder */}
            <View style={styles.cardIconContainer}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>🎲</Text>
              </View>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {game.title}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.popupContainer,
            {
              opacity: cardOpacity,
            },
          ]}
        >
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Game Randomizer</Text>
          </View>

          {/* Carousel Container */}
          <View style={styles.carouselContainer}>
            <View style={styles.cardsWrapper}>
              {games.map((game, index) => renderCard(game, index))}
            </View>
          </View>

          {/* Selected Game Name - Always rendered to maintain popup size */}
          <Animated.View
            style={[
              styles.gameNameContainer,
              {
                opacity: nameOpacity,
              },
            ]}
          >
            <View style={styles.gameNameBackground}>
              <Text style={styles.gameNameText}>
                {selectedGame ? selectedGame.title : ' '}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: width * 0.9,
    maxWidth: 500,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#F66D3D',
    textAlign: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: CARD_HEIGHT + 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  cardsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gameCard: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  cardBackground: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    marginBottom: 15,
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#F66D3D',
    textAlign: 'center',
  },
  gameNameContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    minHeight: 60, // Reserve space to maintain popup size
  },
  gameNameBackground: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  gameNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#F66D3D',
    textAlign: 'center',
  },
});

