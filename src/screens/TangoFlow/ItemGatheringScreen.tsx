import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'ItemGathering'>;

interface Item {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
}

export default function ItemGatheringScreen({ navigation, route }: Props) {
  const { player1, player2, punishment } = route.params;
  
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Something to write with', icon: '✏️', checked: true },
    { id: '2', name: 'Paper', icon: '📄', checked: true },
    { id: '3', name: 'Large Bowl', icon: '🥣', checked: true },
    { id: '4', name: 'Spatula', icon: '🥄', checked: false },
    { id: '5', name: 'Paper Plate', icon: '🍽️', checked: true },
  ]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalGames = Math.floor((checkedCount / items.length) * 150);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gather Items</Text>
        
        <View style={styles.itemsList}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addItemsContainer}>
          <View style={styles.addItemsContent}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.addItemsText}>Add items to unlock more games</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(totalGames / 150) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{totalGames} of 150 Games Available</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.itemsGatheredButton}
        onPress={() => {
          // Navigate to next screen in the flow
          navigation.navigate('GameSelection', {
            player1,
            player2,
            punishment,
            availableItems: items.filter(item => item.checked)
          });
        }}
      >
        <Image 
          source={require('../../../assets/icon-backpack.png')} 
          style={styles.bagIcon}
          resizeMode="contain"
        />
        <Text style={styles.itemsGatheredText}>Items Gathered</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  itemsList: {
    marginBottom: 0,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#F66D3D',
    borderColor: '#F66D3D',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addItemsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    color: '#F66D3D',
    marginRight: 16,
    fontWeight: 'bold',
  },
  addItemsText: {
    fontSize: 18,
    color: '#F66D3D',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  progressSection: {
    marginTop: 18,
    marginBottom: 30,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F66D3D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  itemsGatheredButton: {
    backgroundColor: '#F66D3D',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  bagIcon: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  itemsGatheredText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'semibold',
    fontFamily: 'Nunito',
  },
});
