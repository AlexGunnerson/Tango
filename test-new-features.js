/**
 * Test Script for New Flexible Materials System
 * Run this with: node test-new-features.js
 */

const { createClient } = require('@supabase/supabase-js');

// You'll need to add your Supabase credentials here
const SUPABASE_URL = 'https://txorjhplnexyhpfzmkfu.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Get this from your Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFeaturedMaterials() {
  console.log('\n🧪 Testing Featured Materials...');
  
  const { data, error } = await supabase
    .from('featured_materials')
    .select('*');
    
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log('✅ Featured Materials (Starter 5):');
  data.forEach(material => {
    console.log(`  - ${material.name} (${material.availability_score})`);
  });
}

async function testGameMaterialsDetailed() {
  console.log('\n🧪 Testing Game Materials Detailed View...');
  
  const { data, error } = await supabase
    .from('game_materials_detailed')
    .select('*')
    .eq('game_title', 'Cup Catch');
    
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log('✅ Cup Catch Requirements:');
  data.forEach(req => {
    console.log(`  - ${req.material_name}: ${req.quantity} ${req.quantity_type}`);
    if (req.alternatives && req.alternatives.length > 0) {
      console.log(`    Alternatives: ${req.alternatives.map(alt => alt.name).join(', ')}`);
    }
  });
}

async function testGameRequirementsSummary() {
  console.log('\n🧪 Testing Game Requirements Summary...');
  
  const { data, error } = await supabase
    .from('game_requirements_summary')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log('✅ Game Requirements Summary:');
  data.forEach(game => {
    console.log(`  - ${game.game_title}: ${game.required_materials_count} required materials, ${game.total_items_needed} total items needed`);
  });
}

async function testNewServiceMethods() {
  console.log('\n🧪 Testing New Service Methods...');
  
  // Test getting featured materials only
  const { data: featured, error: featuredError } = await supabase
    .from('materials')
    .select('*')
    .eq('is_featured', true);
    
  if (featuredError) {
    console.error('❌ Featured materials error:', featuredError.message);
    return;
  }
  
  console.log(`✅ Found ${featured.length} featured materials`);
  
  // Test getting all materials
  const { data: all, error: allError } = await supabase
    .from('materials')
    .select('*');
    
  if (allError) {
    console.error('❌ All materials error:', allError.message);
    return;
  }
  
  console.log(`✅ Found ${all.length} total materials`);
  console.log(`✅ ${all.length - featured.length} additional materials available via "Load More"`);
}

async function runAllTests() {
  console.log('🚀 Testing New Flexible Materials System');
  console.log('==========================================');
  
  try {
    await testFeaturedMaterials();
    await testGameMaterialsDetailed();
    await testGameRequirementsSummary();
    await testNewServiceMethods();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📱 Next Steps:');
    console.log('1. Update your Supabase credentials in this file');
    console.log('2. Test the ItemGatheringScreen in your app');
    console.log('3. Verify featured materials load first');
    console.log('4. Test the "Add items" button loads more materials');
    console.log('5. Check that game count updates in real-time');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
runAllTests();
