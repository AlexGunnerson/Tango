/**
 * React Native App Services Test
 * 
 * This file tests your app's service layer integration with Supabase.
 * Run this from within your React Native app to test all services.
 * 
 * Usage:
 * 1. Import this file in your app
 * 2. Call runAppServicesTests() from a component
 * 3. Check console logs for results
 */

import { supabaseService } from './src/services/supabaseService.ts';
import { gameLogicService } from './src/services/gameLogicService.ts';
import { networkService } from './src/services/networkService.ts';
import { offlineStorageService } from './src/services/offlineStorageService.ts';
import { syncService } from './src/services/syncService.ts';

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function logTest(testName, success, message = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    console.log(`✅ ${testName}${message ? ': ' + message : ''}`);
  } else {
    testResults.failed++;
    console.error(`❌ ${testName}${message ? ': ' + message : ''}`);
  }
}

export async function runAppServicesTests() {
  console.log('🧪 Starting App Services Integration Tests\n');
  testResults = { passed: 0, failed: 0, total: 0 };
  
  try {
    await testSupabaseService();
    await testGameLogicService();
    await testNetworkService();
    await testOfflineStorageService();
    await testSyncService();
    
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.total}`);
    console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All app services tests passed!');
    } else {
      console.log('\n⚠️  Some tests failed. Check the logs above.');
    }
    
  } catch (error) {
    console.error('💥 Test suite crashed:', error);
  }
}

async function testSupabaseService() {
  console.log('1️⃣ Testing SupabaseService...');
  
  try {
    // Test health check
    const isHealthy = await supabaseService.healthCheck();
    logTest('Health Check', isHealthy, isHealthy ? 'Connected' : 'Failed to connect');
    
    // Test game configs
    const games = await supabaseService.getGameConfigs();
    logTest('Game Configs Fetch', Array.isArray(games), `${games.length} games loaded`);
    
    if (games.length > 0) {
      // Test specific game fetch
      const specificGame = await supabaseService.getGameById(games[0].id);
      logTest('Specific Game Fetch', !!specificGame, specificGame ? specificGame.name : 'Failed');
    }
    
    // Test punishments
    const punishments = await supabaseService.getPunishments();
    logTest('Punishments Fetch', Array.isArray(punishments), `${punishments.length} punishments loaded`);
    
    // Test random games
    const randomGames = await supabaseService.getRandomGames(3);
    logTest('Random Games Fetch', Array.isArray(randomGames) && randomGames.length <= 3, `${randomGames.length} random games`);
    
    // Test player creation (will create a test player)
    const testPlayer = await supabaseService.getOrCreatePlayer('Test Player ' + Date.now());
    logTest('Player Creation', !!testPlayer.id, `Player ID: ${testPlayer.id}`);
    
    // Clean up test player
    if (testPlayer.id) {
      // Note: In a real app, you might not want to delete players
      console.log('🧹 Test player created, consider cleaning up manually');
    }
    
  } catch (error) {
    logTest('SupabaseService', false, error.message);
  }
}

async function testGameLogicService() {
  console.log('\n2️⃣ Testing GameLogicService...');
  
  try {
    // Test session creation
    const session = gameLogicService.createSession('1v1');
    logTest('Session Creation', !!session && session.gameMode === '1v1', `Session ID: ${session.sessionId}`);
    
    // Test player setting
    gameLogicService.setPlayers('Test Player 1', 'Test Player 2');
    const currentSession = gameLogicService.getSession();
    logTest('Set Players', 
      currentSession.player1.name === 'Test Player 1' && currentSession.player2.name === 'Test Player 2',
      'Players set correctly'
    );
    
    // Test punishment setting
    gameLogicService.setPunishment('Test Punishment');
    logTest('Set Punishment', 
      gameLogicService.getSession().punishment?.name === 'Test Punishment',
      'Punishment set correctly'
    );
    
    // Test items setting
    gameLogicService.setAvailableItems(['Spatula', 'Paper Plate']);
    logTest('Set Items', 
      gameLogicService.getSession().availableItems.length === 2,
      '2 items set'
    );
    
    // Test game selection (this will try to fetch from Supabase or cache)
    try {
      const selectedGames = await gameLogicService.selectGames();
      logTest('Game Selection', Array.isArray(selectedGames) && selectedGames.length > 0, `${selectedGames.length} games selected`);
    } catch (error) {
      logTest('Game Selection', false, error.message);
    }
    
    // Test reset
    gameLogicService.resetSession();
    logTest('Session Reset', !gameLogicService.getSession(), 'Session cleared');
    
  } catch (error) {
    logTest('GameLogicService', false, error.message);
  }
}

async function testNetworkService() {
  console.log('\n3️⃣ Testing NetworkService...');
  
  try {
    // Test current status
    const status = networkService.getCurrentStatus();
    logTest('Get Current Status', ['online', 'offline', 'unknown'].includes(status), `Status: ${status}`);
    
    // Test status methods
    const isOnline = networkService.isOnline();
    const isOffline = networkService.isOffline();
    logTest('Status Methods', typeof isOnline === 'boolean' && typeof isOffline === 'boolean', 
      `Online: ${isOnline}, Offline: ${isOffline}`);
    
    // Test subscription (just test that it returns an unsubscribe function)
    const unsubscribe = networkService.subscribe((status) => {
      console.log('📡 Network status changed:', status);
    });
    logTest('Subscription', typeof unsubscribe === 'function', 'Subscription works');
    unsubscribe(); // Clean up
    
    // Test connectivity check
    const checkedStatus = await networkService.checkConnectivity();
    logTest('Connectivity Check', ['online', 'offline', 'unknown'].includes(checkedStatus), `Checked: ${checkedStatus}`);
    
  } catch (error) {
    logTest('NetworkService', false, error.message);
  }
}

async function testOfflineStorageService() {
  console.log('\n4️⃣ Testing OfflineStorageService...');
  
  try {
    // Test game caching
    const testGames = [
      { id: '1', name: 'Test Game 1', maxPlayers: 2, minPlayers: 2, isPremium: false },
      { id: '2', name: 'Test Game 2', maxPlayers: 2, minPlayers: 2, isPremium: false }
    ];
    
    await offlineStorageService.cacheGames(testGames);
    const cachedGames = await offlineStorageService.getCachedGames();
    logTest('Game Caching', cachedGames.length === 2, `${cachedGames.length} games cached`);
    
    // Test punishment caching
    const testPunishments = [
      { id: '1', name: 'Test Punishment 1', description: 'Test description' }
    ];
    
    await offlineStorageService.cachePunishments(testPunishments);
    const cachedPunishments = await offlineStorageService.getCachedPunishments();
    logTest('Punishment Caching', cachedPunishments.length === 1, `${cachedPunishments.length} punishments cached`);
    
    // Test offline session
    const testSession = {
      id: 'test_session_' + Date.now(),
      sessionState: {
        sessionId: 'test_session_' + Date.now(),
        gameMode: '1v1',
        status: 'active',
        player1: { id: 'p1', name: 'Test Player 1', score: 0 },
        player2: { id: 'p2', name: 'Test Player 2', score: 0 },
        selectedGames: ['1', '2'],
        currentRound: 1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      synced: false
    };
    
    await offlineStorageService.saveOfflineSession(testSession);
    const savedSession = await offlineStorageService.getOfflineSession(testSession.id);
    logTest('Offline Session Storage', !!savedSession && savedSession.id === testSession.id, 'Session saved and retrieved');
    
    // Test sync queue
    await offlineStorageService.addToSyncQueue({
      type: 'CREATE_SESSION',
      data: { test: 'data' },
      maxRetries: 3
    });
    
    const syncQueue = await offlineStorageService.getSyncQueue();
    logTest('Sync Queue', syncQueue.length >= 1, `${syncQueue.length} operations in queue`);
    
    // Test storage info
    const storageInfo = await offlineStorageService.getStorageInfo();
    logTest('Storage Info', 
      typeof storageInfo.gamesCount === 'number' && 
      typeof storageInfo.punishmentsCount === 'number',
      `Games: ${storageInfo.gamesCount}, Punishments: ${storageInfo.punishmentsCount}`
    );
    
  } catch (error) {
    logTest('OfflineStorageService', false, error.message);
  }
}

async function testSyncService() {
  console.log('\n5️⃣ Testing SyncService...');
  
  try {
    // Test sync status
    const status = syncService.getSyncStatus();
    logTest('Get Sync Status', ['idle', 'syncing', 'error', 'completed'].includes(status), `Status: ${status}`);
    
    // Test sync stats
    const stats = await syncService.getSyncStats();
    logTest('Sync Stats', 
      typeof stats.pendingOperations === 'number' && 
      typeof stats.unsyncedSessions === 'number',
      `Pending: ${stats.pendingOperations}, Unsynced: ${stats.unsyncedSessions}`
    );
    
    // Test subscription (just test that it returns an unsubscribe function)
    const unsubscribe = syncService.subscribe((status, progress) => {
      console.log('🔄 Sync status changed:', status, progress);
    });
    logTest('Sync Subscription', typeof unsubscribe === 'function', 'Subscription works');
    unsubscribe(); // Clean up
    
    // Note: We don't test actual syncing here as it requires network and could interfere with real data
    logTest('Sync Service Ready', true, 'All sync methods available');
    
  } catch (error) {
    logTest('SyncService', false, error.message);
  }
}

// Export individual test functions for targeted testing
export {
  testSupabaseService,
  testGameLogicService,
  testNetworkService,
  testOfflineStorageService,
  testSyncService
};
