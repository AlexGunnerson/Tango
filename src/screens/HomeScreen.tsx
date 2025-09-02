import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
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
    color: '#B2282F',
    fontSize: 24,
    fontWeight: 'bold',
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
    color: '#B2282F',
    fontSize: 24,
    fontWeight: 'bold',
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
    color: '#B2282F',
    fontSize: 20,
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
  menuIcon: {
    position: 'absolute',
    left: 18,
    top: 86,
    width: 35,
    height: 27,
  },
});
