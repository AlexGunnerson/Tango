import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'PlayerSelection'>;

export default function PlayerSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Player Selection
        </Text>
        <Text className="text-gray-600 text-center">
          Enter player names for the 1v1 Tango duel.
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          This screen will be implemented in the 1v1 Tango Flow phase!
        </Text>
      </View>
    </SafeAreaView>
  );
}
