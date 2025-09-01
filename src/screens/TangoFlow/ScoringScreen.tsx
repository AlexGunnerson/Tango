import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'Scoring'>;

export default function ScoringScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Round Results
        </Text>
        <Text className="text-gray-600 text-center">
          Select the winner and view the scoreboard.
        </Text>
      </View>
    </SafeAreaView>
  );
}
