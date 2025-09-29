import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import type { RootStackScreenProps } from '../../navigation/types';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useUser } from '../../hooks/useUser';
import { supabaseService, DatabaseMaterial } from '../../services/supabaseService';
import { Material } from '../../types/material';

type Props = RootStackScreenProps<'ItemGathering'>;

interface Item {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  alternatives?: string[];
  availabilityScore?: string;
}

export default function ItemGatheringScreen({ navigation, route }: Props) {
  const { player1, player2, punishment, originalPlayer1, originalPlayer2, player1Score, player2Score } = route.params;
  
  // Get game logic functions
  const { setAvailableItems, selectGames } = useGameLogic();
  
  // Get persistent user for player1
  const { user, isLoading: userLoading, isInitialized } = useUser();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableGamesCount, setAvailableGamesCount] = useState<number>(0);
  const [loadingGamesCount, setLoadingGamesCount] = useState(false);
  const [showingFeaturedOnly, setShowingFeaturedOnly] = useState(true);
  const [loadingMoreItems, setLoadingMoreItems] = useState(false);

  // Fetch materials from Supabase on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        // Start with featured materials only
        const materials = await supabaseService.getFeaturedMaterials();
        
        // Transform database materials to Item format
        const transformedItems: Item[] = materials.map((material: DatabaseMaterial) => ({
          id: material.id,
          name: material.material,
          icon: material.icon || '📦', // Default icon if none provided
          checked: material.availability_score === '1-Everyone Has It', // Auto-check most available items
          alternatives: [
            material.alternative_1,
            material.alternative_2,
            material.alternative_3
          ].filter(Boolean) as string[], // Filter out null/undefined values
          availabilityScore: material.availability_score
        }));
        
        setItems(transformedItems);
      } catch (err) {
        console.error('Error fetching materials:', err);
        setError('Failed to load materials. Please try again.');
        // Fallback to hardcoded items if Supabase fails
        setItems([
          { id: '1', name: 'Something to write with', icon: '✏️', checked: true },
          { id: '2', name: 'Paper', icon: '📄', checked: true },
          { id: '3', name: 'Large Bowl', icon: '🥣', checked: true },
          { id: '4', name: 'Spatula', icon: 'icon-spatula', checked: false },
          { id: '5', name: 'Paper Plate', icon: 'icon-plate', checked: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Function to load additional non-featured materials
  const loadMoreMaterials = async () => {
    if (loadingMoreItems || !showingFeaturedOnly) return;
    
    try {
      setLoadingMoreItems(true);
      const allMaterials = await supabaseService.getAllMaterials();
      
      // Filter out materials we already have (featured ones)
      const existingIds = new Set(items.map(item => item.id));
      const newMaterials = allMaterials.filter(material => !existingIds.has(material.id));
      
      // Transform new materials to Item format
      const newItems: Item[] = newMaterials.map((material: DatabaseMaterial) => ({
        id: material.id,
        name: material.material,
        icon: material.icon || '📦',
        checked: false, // New items start unchecked
        alternatives: [
          material.alternative_1,
          material.alternative_2,
          material.alternative_3
        ].filter(Boolean) as string[],
        availabilityScore: material.availability_score
      }));
      
      setItems(prev => [...prev, ...newItems]);
      setShowingFeaturedOnly(false);
    } catch (err) {
      console.error('Error loading additional materials:', err);
      setError('Failed to load additional materials.');
    } finally {
      setLoadingMoreItems(false);
    }
  };

  // Function to update available games count based on selected items
  const updateAvailableGamesCount = async (selectedItems: string[]) => {
    try {
      setLoadingGamesCount(true);
      const count = await supabaseService.getAvailableGamesCountUnified(selectedItems);
      
      setAvailableGamesCount(count);
    } catch (err) {
      console.error('❌ Error fetching available games count:', err);
      // Fallback to a reasonable estimate if the call fails
      setAvailableGamesCount(Math.floor((selectedItems.length / 10) * 150));
    } finally {
      setLoadingGamesCount(false);
    }
  };

  const toggleItem = (id: string) => {
    setItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      
      // Update games count with the new selection
      const selectedItems = updatedItems.filter(item => item.checked).map(item => item.name);
      updateAvailableGamesCount(selectedItems);
      
      return updatedItems;
    });
  };

  // Initial games count calculation when items are loaded
  useEffect(() => {
    if (items.length > 0) {
      const selectedItems = items.filter(item => item.checked).map(item => item.name);
      updateAvailableGamesCount(selectedItems);
    }
  }, [items.length]); // Only run when items are initially loaded

  const checkedCount = items.filter(item => item.checked).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F66D3D" />
          <Text style={styles.loadingText}>Loading materials...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Gather Items</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.itemsList}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.itemContent}>
                {item.icon === 'icon-spatula' ? (
                  <Image 
                    source={require('../../../assets/icon-spatula.png')} 
                    style={styles.itemIconImage}
                    resizeMode="contain"
                  />
                ) : item.icon === 'icon-plate' ? (
                  <Image 
                    source={require('../../../assets/icon-plate.png')} 
                    style={styles.itemIconImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                )}
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.alternatives && item.alternatives.length > 0 && (
                    <Text style={styles.alternatives}>
                      Alternatives: {item.alternatives.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.addItemsContainer, loadingMoreItems && styles.addItemsContainerDisabled]}
          onPress={loadMoreMaterials}
          disabled={loadingMoreItems || !showingFeaturedOnly}
        >
          <View style={styles.addItemsContent}>
            {loadingMoreItems ? (
              <>
                <ActivityIndicator size="small" color="#F66D3D" />
                <Text style={styles.addItemsText}>Loading more items...</Text>
              </>
            ) : showingFeaturedOnly ? (
              <>
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.addItemsText}>Add items to unlock more games</Text>
              </>
            ) : (
              <>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.addItemsText}>All items loaded</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(availableGamesCount / 150) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {loadingGamesCount ? 'Calculating...' : `${availableGamesCount} of 150 Games Available`}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.itemsGatheredButton}
        onPress={async () => {
          try {
            // Set available items in game logic service
            const selectedItems = items.filter(item => item.checked).map(item => item.name);
            setAvailableItems(selectedItems);
            
            // Save materials to user_materials table for the persistent user (player1)
            // This enables persistent material tracking and efficient game matching
            if (user && user.id) {
              await supabaseService.updateCurrentUserMaterials(user.id, selectedItems);
            } else {
              // Fallback to name-based method if user system isn't ready
              await supabaseService.updateUserMaterialsByName(player1, selectedItems);
            }
            
            // Select games based on user materials in database
            await selectGames(user?.id);
            
            // Navigate to first game instructions screen
            navigation.navigate('GameInstructionsScreen1', {
              player1,
              player2,
              punishment,
              availableItems: items.filter(item => item.checked),
              originalPlayer1,
              originalPlayer2,
              player1Score,
              player2Score
            });
          } catch (error) {
            console.error('Error saving materials:', error);
            // Continue with navigation even if saving fails
            const selectedItems = items.filter(item => item.checked).map(item => item.name);
            setAvailableItems(selectedItems);
            await selectGames(user?.id);
            
            navigation.navigate('GameInstructionsScreen1', {
              player1,
              player2,
              punishment,
              availableItems: items.filter(item => item.checked),
              originalPlayer1,
              originalPlayer2,
              player1Score,
              player2Score
            });
          }
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
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#333333',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
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
    alignItems: 'flex-start',
    flex: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 0,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  itemIconImage: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
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
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addItemsContainerDisabled: {
    opacity: 0.6,
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
  checkIcon: {
    fontSize: 24,
    color: '#4CAF50',
    marginRight: 16,
    fontWeight: 'bold',
  },
  addItemsText: {
    fontSize: 16,
    color: '#F66D3D',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  progressSection: {
    marginTop: 12,
    marginBottom: 20,
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
    padding: 14,
    margin: 16,
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
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'semibold',
    fontFamily: 'Nunito',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666666',
    fontFamily: 'Nunito',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  alternatives: {
    fontSize: 10,
    color: '#888888',
    fontFamily: 'Nunito',
    marginTop: 1,
    fontStyle: 'italic',
  },

});
