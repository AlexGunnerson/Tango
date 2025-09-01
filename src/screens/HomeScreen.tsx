import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Logo */}
        <Image 
          source={require('../../assets/tango-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Game Mode Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonIndigo]}
            onPress={() => navigation.navigate('PlayerSelection')}
          >
            <Text style={styles.buttonText}>
              1 vs 1 Tango
            </Text>
            <Text style={styles.buttonSubtext}>
              Competitive duel for two players
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonGreen]}
            onPress={() => navigation.navigate('TeamSelection', { mode: '2v2' })}
          >
            <Text style={styles.buttonText}>
              2 vs 2
            </Text>
            <Text style={styles.buttonSubtext}>
              Team-based competition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={() => navigation.navigate('TeamSelection', { mode: 'coop' })}
          >
            <Text style={styles.buttonText}>
              Co-Op
            </Text>
            <Text style={styles.buttonSubtext}>
              Work together as a team
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPurple]}
            onPress={() => navigation.navigate('TournamentSetup')}
          >
            <Text style={styles.buttonText}>
              Tournament
            </Text>
            <Text style={styles.buttonSubtext}>
              Bracket-style competition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonGray]}
            onPress={() => navigation.navigate('GameLibrary')}
          >
            <Text style={styles.buttonText}>
              Game Library
            </Text>
            <Text style={styles.buttonSubtext}>
              Browse all available games
            </Text>
          </TouchableOpacity>
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
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIndigo: {
    backgroundColor: '#6366f1',
  },
  buttonGreen: {
    backgroundColor: '#16a34a',
  },
  buttonBlue: {
    backgroundColor: '#2563eb',
  },
  buttonPurple: {
    backgroundColor: '#9333ea',
  },
  buttonGray: {
    backgroundColor: '#4b5563',
    marginTop: 32,
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
});
