import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'GameInstructions'>;

export default function GameInstructionsScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, availableItems } = route.params;
  const [isHandicapModalVisible, setIsHandicapModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Game Title */}
        <Text style={styles.gameTitle}>The Blind March</Text>
        
        {/* How to Play Section */}
        <View style={styles.howToPlaySection}>
          <View style={styles.howToPlayHeader}>
            <Text style={styles.howToPlayText}>How to Play</Text>
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
          </View>
          
          <Text style={styles.instructionsText}>
            You have 90 seconds to go nowhere! Blindfolded and marching in place, your mission is to see who can stay closest to their original position. Whoever ends up closest to the starting position wins!
          </Text>
        </View>

        {/* Player Ready Section */}
        <View style={styles.playerReadySection}>
          <Text style={styles.playerReadyText}>
            <Text style={styles.playerName}>{player1}</Text> get ready, you're up first!
          </Text>
        </View>

        {/* Tango Button */}
        <TouchableOpacity 
          style={styles.tangoButton}
          onPress={() => setIsHandicapModalVisible(true)}
        >
          <Text style={styles.tangoButtonText}>Tango!</Text>
        </TouchableOpacity>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{player1}: 2 | {player2}: 0</Text>
        </View>
      </View>

      {/* Handicap Modal */}
      <Modal
        visible={isHandicapModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHandicapModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsHandicapModalVisible(false)}>
          <Pressable style={styles.handicapCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.handicapTitle}>Handicap for {player1}!</Text>
            
            <Text style={styles.handicapDescription}>
              At 45 seconds, {player1} must do a full 360 degree turn without changing the speed of marching.
            </Text>

            <TouchableOpacity 
              style={styles.handicapTangoButton}
              onPress={() => {
                setIsHandicapModalVisible(false);
                navigation.navigate('Gameplay', {
                  player1,
                  player2,
                  punishment,
                  availableItems,
                  gameTitle: 'The Blind March'
                });
              }}
            >
              <Text style={styles.handicapTangoButtonText}>Tango!</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    fontFamily: 'Nunito',
  },
  howToPlaySection: {
    marginBottom: 40,
  },
  howToPlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  howToPlayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 12,
    fontFamily: 'Nunito',
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F66D3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    fontFamily: 'Nunito',
  },
  playerReadySection: {
    marginBottom: 60,
  },
  playerReadyText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
  },
  playerName: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito',
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  handicapCard: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  handicapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Nunito',
  },
  handicapDescription: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Nunito',
  },
  handicapTangoButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  handicapTangoButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
  },
});
