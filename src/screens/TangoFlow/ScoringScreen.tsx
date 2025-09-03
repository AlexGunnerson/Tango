import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'Scoring'>;

export default function ScoringScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Round Results
        </Text>
        <Text style={styles.subtitle}>
          Select the winner and view the scoreboard.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    fontFamily: 'Nunito',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Nunito',
  },

});
