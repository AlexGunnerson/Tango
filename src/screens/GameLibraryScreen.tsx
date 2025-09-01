import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'GameLibrary'>;

export default function GameLibraryScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Game Library
        </Text>
        <Text className="text-gray-600 text-center">
          This screen will show all available games with filtering options.
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Coming soon in the next development phase!
        </Text>
      </View>
    </SafeAreaView>
  );
}
