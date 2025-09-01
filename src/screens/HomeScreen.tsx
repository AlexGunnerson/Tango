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
            style={styles.button}
            onPress={() => navigation.navigate('PlayerSelection')}
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
    width: 361,
    height: 125,
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
    left: 56,
    top: 29,
    width: 67,
    height: 71,
  },
  karateImage2: {
    position: 'absolute',
    left: 236,
    top: 25,
    width: 73,
    height: 78,
  },
  vsContainer: {
    position: 'absolute',
    left: 146,
    top: 67,
    width: 70,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    color: '#B2282F',
    fontSize: 24,
    fontWeight: 'bold',
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
