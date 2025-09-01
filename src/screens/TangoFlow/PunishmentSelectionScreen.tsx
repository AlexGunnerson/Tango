import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'PunishmentSelection'>;

export default function PunishmentSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Punishment Selection
        </Text>
        <Text className="text-gray-600 text-center">
          Choose a fun punishment for the loser.
        </Text>
      </View>
    </SafeAreaView>
  );
}
