import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image, Modal, Pressable, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [isOneVOneCardVisible, setIsOneVOneCardVisible] = useState(false);
  const [isPunishmentCardVisible, setIsPunishmentCardVisible] = useState(false);
  const [player2Name, setPlayer2Name] = useState('');
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // Reset player name when returning to home screen
  useFocusEffect(
    React.useCallback(() => {
      setPlayer2Name('');
      setIsTextInputFocused(false);
    }, [])
  );

  const handleModalClose = () => {
    setIsOneVOneCardVisible(false);
    setPlayer2Name('');
    setIsTextInputFocused(false);
  };

  const handlePunishmentModalClose = () => {
    setIsPunishmentCardVisible(false);
    setPlayer2Name('');
    setIsTextInputFocused(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* DEV: Screen Name Indicator */}
      {__DEV__ && (
        <View style={styles.devScreenIndicator}>
          <Text style={styles.devScreenText}>HomeScreen</Text>
        </View>
      )}
      {/* Menu Icon */}
      <Image 
        source={require('../../assets/menu-red.png')} 
        style={styles.menuIcon}
      />

      {/* Logo */}
      <View style={styles.content}>
        <Image 
          source={require('../../assets/tango-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Game Mode Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsOneVOneCardVisible(true)}
          >
            <Image 
              source={require('../../assets/karate-yellow-1.png')} 
              style={styles.karateImage}
            />
            <Image 
              source={require('../../assets/karate-red-2.png')} 
              style={styles.karateImage2}
            />
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeamSelection', { mode: '2v2' })}
          >
            <Text style={styles.buttonText}>
              2 vs 2
            </Text>
            <Text style={styles.buttonSubtext}>
              Team-based competition
            </Text>
            <Image 
              source={require('../../assets/boxing-red.png')} 
              style={styles.boxingRed1}
            />
            <Image 
              source={require('../../assets/boxing-red.png')} 
              style={styles.boxingRed2}
            />
            <Image 
              source={require('../../assets/boxing-yellow.png')} 
              style={styles.boxingYellow1}
            />
            <Image 
              source={require('../../assets/boxing-yellow.png')} 
              style={styles.boxingYellow2}
            />
            <View style={styles.vsContainer2}>
              <Text style={styles.vsText}>VS</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeamSelection', { mode: 'coop' })}
          >
            <Text style={styles.buttonText}>
              Co-Op
            </Text>
            <Text style={styles.buttonSubtext}>
              Work together as a team
            </Text>
            <Image 
              source={require('../../assets/acro-yoga.png')} 
              style={styles.acroYoga}
            />
            <View style={styles.coopTextContainer}>
              <Text style={styles.coopText}>Co-Op</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TournamentSetup')}
          >
            <Text style={styles.buttonText}>
              Tournament
            </Text>
            <Text style={styles.buttonSubtext}>
              Bracket-style competition
            </Text>
            <Image 
              source={require('../../assets/bracket.png')} 
              style={styles.bracket}
            />
            <View style={styles.tournamentTextContainer}>
              <Text style={styles.tournamentText}>Tournament</Text>
            </View>
          </TouchableOpacity>


        </View>
      </View>
      {/* 1v1 Card Modal */}
      <Modal
        visible={isOneVOneCardVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleModalClose}>
          <Pressable style={styles.cardContainer} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity style={styles.cardCloseButton} onPress={handleModalClose}>
              <Text style={styles.cardCloseText}>×</Text>
            </TouchableOpacity>
            <Image 
              source={require('../../assets/karate-yellow-1.png')}
              style={styles.cardKarateLeft}
              resizeMode="contain"
            />
            <View style={styles.cardNameBoxLeft}>
              <Text style={styles.cardNameLeftText}>Alex</Text>
            </View>
            <Text style={styles.cardVsText}>VS</Text>
            <Image 
              source={require('../../assets/karate-red-2.png')}
              style={styles.cardKarateRight}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/icon-add-user.png')}
              style={styles.cardAddUserIcon}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.cardNameBoxRight}
              activeOpacity={1}
              onPress={() => textInputRef.current?.focus()}
            >
              <TextInput
                ref={textInputRef}
                style={[
                  styles.cardNameRightTextInput,
                  { color: player2Name ? '#D84B15' : '#D84B15' }
                ]}
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholder={isTextInputFocused ? "" : "Player 2..."}
                placeholderTextColor="#B0B0B0"
                multiline={false}
                maxLength={20}
                textAlign="center"
                autoFocus={false}
                selectionColor="#D84B15"
                cursorColor="#D84B15"
                clearTextOnFocus={false}
                onFocus={() => setIsTextInputFocused(true)}
                onBlur={() => setIsTextInputFocused(false)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cardArrowButton}
              onPress={() => {
                setIsOneVOneCardVisible(false);
                setIsPunishmentCardVisible(true);
              }}
            >
              <Text style={styles.cardArrowText}>→</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Punishment Selection Modal */}
      <Modal
        visible={isPunishmentCardVisible}
        transparent
        animationType="fade"
        onRequestClose={handlePunishmentModalClose}
      >
        <Pressable style={styles.modalBackdrop} onPress={handlePunishmentModalClose}>
          <Pressable style={styles.punishmentContainer} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                setIsPunishmentCardVisible(false);
                setIsOneVOneCardVisible(true);
              }}
            >
              <Text style={styles.backArrowText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardCloseButton} onPress={handlePunishmentModalClose}>
              <Text style={styles.cardCloseText}>×</Text>
            </TouchableOpacity>
            
            <Text style={styles.punishmentTitle}>Select a Punishment</Text>
            
            <TouchableOpacity 
              style={styles.punishmentOption}
              onPress={() => {
                setIsPunishmentCardVisible(false);
                setIsOneVOneCardVisible(false);
                navigation.navigate('GameInstructionsScreen1', {
                  player1: 'Alex',
                  player2: player2Name || 'Player 2',
                  punishment: 'The Human Butler',
                  availableItems: [
                    { id: 1, name: 'Spatula', selected: true },
                    { id: 2, name: 'Paper Plate', selected: true },
                    { id: 3, name: 'Marshmallows', selected: true }
                  ],
                  originalPlayer1: 'Alex',
                  originalPlayer2: player2Name || 'Player 2',
                  player1Score: 0,
                  player2Score: 0
                });
              }}
            >
              <Text style={styles.punishmentName1}>The Human Butler</Text>
              <Text style={styles.punishmentDescription}>The loser must receive a snack or drink of the winner's choice.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.punishmentOption}
              onPress={() => {
                setIsPunishmentCardVisible(false);
                setIsOneVOneCardVisible(false);
                navigation.navigate('GameInstructionsScreen1', {
                  player1: 'Alex',
                  player2: player2Name || 'Player 2',
                  punishment: 'The Dramatic Defeat',
                  availableItems: [
                    { id: 1, name: 'Spatula', selected: true },
                    { id: 2, name: 'Paper Plate', selected: true },
                    { id: 3, name: 'Marshmallows', selected: true }
                  ],
                  originalPlayer1: 'Alex',
                  originalPlayer2: player2Name || 'Player 2',
                  player1Score: 0,
                  player2Score: 0
                });
              }}
            >
              <Text style={styles.punishmentName2}>The Dramatic Defeat</Text>
              <Text style={styles.punishmentDescription}>The loser must lie on the floor dramatically with their tongue out for 30 seconds.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.punishmentOption}
              onPress={() => {
                setIsPunishmentCardVisible(false);
                setIsOneVOneCardVisible(false);
                navigation.navigate('GameInstructionsScreen1', {
                  player1: 'Alex',
                  player2: player2Name || 'Player 2',
                  punishment: 'Concession Speech',
                  availableItems: [
                    { id: 1, name: 'Spatula', selected: true },
                    { id: 2, name: 'Paper Plate', selected: true },
                    { id: 3, name: 'Marshmallows', selected: true }
                  ],
                  originalPlayer1: 'Alex',
                  originalPlayer2: player2Name || 'Player 2',
                  player1Score: 0,
                  player2Score: 0
                });
              }}
            >
              <Text style={styles.punishmentName3}>Concession Speech</Text>
              <Text style={styles.punishmentDescription}>The loser must deliver a pre-written speech praising the winner's skills and declaring their defeat.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.punishmentOptionShort}
              onPress={() => {
                setIsPunishmentCardVisible(false);
                setIsOneVOneCardVisible(false);
                navigation.navigate('GameInstructionsScreen1', {
                  player1: 'Alex',
                  player2: player2Name || 'Player 2',
                  punishment: undefined,
                  availableItems: [
                    { id: 1, name: 'Spatula', selected: true },
                    { id: 2, name: 'Paper Plate', selected: true },
                    { id: 3, name: 'Marshmallows', selected: true }
                  ],
                  originalPlayer1: 'Alex',
                  originalPlayer2: player2Name || 'Player 2',
                  player1Score: 0,
                  player2Score: 0
                });
              }}
            >
              <Text style={styles.punishmentNameNone}>No Punishment</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    width: 135,
    height: 62,
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: 350,
    height: 145,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGray: {
    marginTop: 32,
  },
  karateImage: {
    position: 'absolute',
    left: 52,
    top: 38,
    width: 73,
    height: 77,
  },
  karateImage2: {
    position: 'absolute',
    left: 234,
    top: 34,
    width: 75,
    height: 80,
  },
  vsContainer: {
    position: 'absolute',
    left: 142,
    top: 68,
    width: 70,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    color: '#5A5A5A',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  boxingRed1: {
    position: 'absolute',
    left: 225,
    top: 32,
    width: 47,
    height: 90,
  },
  boxingRed2: {
    position: 'absolute',
    left: 280,
    top: 28,
    width: 43,
    height: 82,
  },
  boxingYellow1: {
    position: 'absolute',
    left: 37,
    top: 28,
    width: 43,
    height: 82,
  },
  boxingYellow2: {
    position: 'absolute',
    left: 85,
    top: 32,
    width: 47,
    height: 90,
  },
  vsContainer2: {
    position: 'absolute',
    left: 146,
    top: 80,
    width: 70,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acroYoga: {
    position: 'absolute',
    left: 139,
    top: 20,
    width: 85,
    height: 78,
  },
  coopTextContainer: {
    position: 'absolute',
    left: 142,
    top: 105,
    width: 80,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coopText: {
    color: '#5A5A5A',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  bracket: {
    position: 'absolute',
    left: 12,
    top: 18,
    width: 325,
    height: 93,
  },
  tournamentTextContainer: {
    position: 'absolute',
    left: 106,
    top: 102,
    width: 140,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentText: {
    color: '#5A5A5A',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: 330,
    height: 270,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCloseText: {
    fontSize: 24,
    color: '#888',
    lineHeight: 24,
  },
  cardKarateLeft: {
    position: 'absolute',
    left: 40,
    top: 85,
    width: 80,
    height: 80,
    zIndex: 2,
  },
  cardKarateRight: {
    position: 'absolute',
    right: 45,
    top: 80,
    width: 80,
    height: 86,
    zIndex: 2,
  },
  cardAddUserIcon: {
    position: 'absolute',
    right: 15,
    top: 110,
    width: 28,
    height: 28,
    zIndex: 3,
  },
  cardVsText: {
    color: '#B2282F',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardNameBoxLeft: {
    position: 'absolute',
    left: 20,
    top: 165,
    width: 120,
    height: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNameLeftText: {
    color: '#d99816',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardNameBoxRight: {
    position: 'absolute',
    right: 24,
    top: 165,
    width: 120,
    height: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNameRightTextInput: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    paddingHorizontal: 8,
  },
  cardArrowButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 30,
    height: 30,
    backgroundColor: '#B2282F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrowText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  punishmentContainer: {
    width: 350,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  punishmentTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  punishmentOption: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  punishmentName1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2B624',
    marginBottom: 8,
  },
  punishmentName2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E76B28',
    marginBottom: 8,
  },
  punishmentName3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45200',
    marginBottom: 8,
  },
  punishmentOptionShort: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  punishmentNameNone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AA5003',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowText: {
    fontSize: 24,
    color: '#888',
    lineHeight: 24,
  },
  punishmentDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  menuIcon: {
    position: 'absolute',
    left: 18,
    top: 86,
    width: 35,
    height: 27,
  },
  // DEV: Screen indicator styles
  devScreenIndicator: {
    position: 'absolute',
    top: 90,
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
