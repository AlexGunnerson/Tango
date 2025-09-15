import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOfflineMode } from '../hooks/useOfflineMode';

interface OfflineIndicatorProps {
  showSyncButton?: boolean;
  onSyncPress?: () => void;
}

export default function OfflineIndicator({ showSyncButton = true, onSyncPress }: OfflineIndicatorProps) {
  const { 
    networkStatus, 
    syncStatus, 
    syncProgress, 
    isOffline, 
    canSync, 
    forceSync 
  } = useOfflineMode();

  const handleSyncPress = async () => {
    if (onSyncPress) {
      onSyncPress();
    } else if (canSync) {
      try {
        await forceSync();
      } catch (error) {
        console.error('Failed to sync:', error);
      }
    }
  };

  if (networkStatus === 'unknown') {
    return null; // Don't show anything while status is unknown
  }

  return (
    <View style={styles.container}>
      {/* Network Status */}
      <View style={[styles.statusIndicator, isOffline ? styles.offline : styles.online]}>
        <Text style={[styles.statusText, isOffline ? styles.offlineText : styles.onlineText]}>
          {isOffline ? '📱 Offline' : '🌐 Online'}
        </Text>
      </View>

      {/* Sync Status */}
      {syncStatus !== 'idle' && (
        <View style={styles.syncContainer}>
          {syncStatus === 'syncing' && (
            <View style={styles.syncStatus}>
              <Text style={styles.syncText}>
                🔄 Syncing...
                {syncProgress && ` ${syncProgress.current}/${syncProgress.total}`}
              </Text>
            </View>
          )}
          
          {syncStatus === 'completed' && (
            <View style={styles.syncStatus}>
              <Text style={styles.syncText}>✅ Synced</Text>
            </View>
          )}
          
          {syncStatus === 'error' && (
            <View style={styles.syncStatus}>
              <Text style={styles.syncText}>❌ Sync failed</Text>
            </View>
          )}
        </View>
      )}

      {/* Sync Button */}
      {showSyncButton && canSync && (
        <TouchableOpacity 
          style={styles.syncButton} 
          onPress={handleSyncPress}
          disabled={!canSync}
        >
          <Text style={styles.syncButtonText}>🔄 Sync</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    marginVertical: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  online: {
    backgroundColor: '#d4edda',
  },
  offline: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  onlineText: {
    color: '#155724',
  },
  offlineText: {
    color: '#721c24',
  },
  syncContainer: {
    marginRight: 8,
  },
  syncStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  syncText: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  syncButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});
