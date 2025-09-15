#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 * 
 * This is a basic Node.js script to test your Supabase connection and data.
 * Run with: node test-supabase-simple.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://txorjhplnexyhpfzmkfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b3JqaHBsbmV4eWhwZnpta2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjczMzAsImV4cCI6MjA3MzA0MzMzMH0.BksEtGaEAsrsGNI3x99CqJ5US3kESPfE5N7McMPFHfM';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase
      .from('game_configs')
      .select('count');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!\n');
    
    // Test 2: Game configurations
    console.log('2️⃣ Testing game configurations...');
    const { data: games, error: gamesError } = await supabase
      .from('game_configs')
      .select('*')
      .limit(5);
    
    if (gamesError) {
      console.error('❌ Games fetch failed:', gamesError.message);
    } else {
      console.log(`✅ Found ${games.length} games:`);
      games.forEach((game, index) => {
        console.log(`   ${index + 1}. ${game.name} (${game.min_players}-${game.max_players} players)`);
      });
    }
    
    // Test 3: Punishments
    console.log('\n3️⃣ Testing punishments...');
    const { data: punishments, error: punishmentsError } = await supabase
      .from('punishments')
      .select('*')
      .limit(5);
    
    if (punishmentsError) {
      console.error('❌ Punishments fetch failed:', punishmentsError.message);
    } else {
      console.log(`✅ Found ${punishments.length} punishments:`);
      punishments.forEach((punishment, index) => {
        console.log(`   ${index + 1}. ${punishment.name}`);
      });
    }
    
    // Test 4: Database schema check
    console.log('\n4️⃣ Testing database schema...');
    const tables = ['game_configs', 'punishments', 'players', 'game_sessions', 'match_history'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
      }
    }
    
    // Test 5: Views check
    console.log('\n5️⃣ Testing database views...');
    const views = ['player_detailed_stats', 'match_history_detailed'];
    
    for (const view of views) {
      try {
        const { error } = await supabase
          .from(view)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ View '${view}': ${error.message}`);
        } else {
          console.log(`✅ View '${view}': accessible`);
        }
      } catch (err) {
        console.log(`❌ View '${view}': ${err.message}`);
      }
    }
    
    console.log('\n🎉 Basic Supabase tests completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Run your React Native app');
    console.log('   2. Use the TestRunner component for full integration tests');
    console.log('   3. Check that games appear in your app');
    
    return true;
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
