# 🧪 Supabase Integration Testing Guide

This guide provides comprehensive testing tools to verify your Supabase integration is working correctly.

## 📋 Test Files Overview

### 1. `test-supabase-simple.mjs` - Basic Connection Test
**Purpose**: Quick Node.js test to verify Supabase connection and basic data access.

**Usage**:
```bash
node test-supabase-simple.mjs
```

**What it tests**:
- ✅ Database connection
- ✅ Game configurations table
- ✅ Punishments table  
- ✅ All database tables accessibility
- ✅ Database views accessibility

### 2. `test-supabase-integration.js` - Comprehensive Backend Test
**Purpose**: Full database integration test with CRUD operations.

**Usage**:
```bash
node test-supabase-integration.js
```

**What it tests**:
- ✅ Database connectivity
- ✅ Game configurations CRUD
- ✅ Punishments management
- ✅ Player management (create, read, update)
- ✅ Game sessions (create, update, complete)
- ✅ Match history tracking
- ✅ Statistics views
- ✅ Row Level Security (basic)
- ✅ Automatic cleanup

### 3. `test-app-services.js` - App Services Test
**Purpose**: Tests your React Native app's service layer integration.

**Usage**: Import and call from within your React Native app:
```javascript
import { runAppServicesTests } from './test-app-services';

// In a component or screen
await runAppServicesTests();
```

**What it tests**:
- ✅ SupabaseService methods
- ✅ GameLogicService functionality
- ✅ NetworkService connectivity detection
- ✅ OfflineStorageService caching
- ✅ SyncService synchronization

### 4. `src/components/TestRunner.tsx` - UI Test Component
**Purpose**: React Native component with UI for running tests in your app.

**Usage**: Add to any screen in your app:
```tsx
import TestRunner from '../components/TestRunner';

// In your screen's JSX
<TestRunner />
```

**Features**:
- 🎯 Interactive UI for running tests
- 📊 Real-time test results display
- 📈 Test summary with success rates
- 🧹 Clear results functionality
- ⏱️ Timestamp tracking

## 🚀 Quick Start Testing

### Step 1: Basic Connection Test
```bash
cd /Users/alexgunnerson/Documents/App\ Dev/Tango\!/TangoApp
node test-supabase-simple.mjs
```

**Expected Output**:
```
✅ Connection successful!
✅ Found 5 games:
   1. The Blind March (2-2 players)
   2. Marshmallow Scoop (2-2 players)
   ...
✅ Found 6 punishments:
   1. The Human Butler
   2. The Dramatic Defeat
   ...
```

### Step 2: Comprehensive Backend Test
```bash
node test-supabase-integration.js
```

**Expected Output**:
```
✅ Database connection successful
✅ Fetched 5 game configurations
✅ Created test player: Test Player 1 (ID: uuid)
✅ Created game session: uuid
✅ All Supabase integration tests passed!
```

### Step 3: App Integration Test
Add the TestRunner component to your HomeScreen temporarily:

```tsx
// In src/screens/HomeScreen.tsx
import TestRunner from '../components/TestRunner';

// Add to your JSX (temporarily)
<TestRunner />
```

Then in your app:
1. Navigate to the screen with TestRunner
2. Tap "🚀 Run Tests"
3. Watch the real-time results

## 📊 Understanding Test Results

### ✅ Success Indicators
- **Connection**: Database is accessible
- **Data Loading**: Games and punishments load correctly
- **CRUD Operations**: Create, read, update, delete work
- **Services**: All app services function properly
- **Offline Mode**: Caching and sync work correctly

### ❌ Common Issues & Solutions

#### "Connection failed"
- Check internet connection
- Verify Supabase URL and API key
- Check if Supabase project is active

#### "Table not accessible"
- Run database migrations
- Check Row Level Security policies
- Verify table exists in Supabase dashboard

#### "No games/punishments found"
- Seed your database with initial data
- Check data was inserted correctly
- Verify data isn't filtered out by RLS

#### "Player creation failed"
- Check RLS policies allow anonymous inserts
- Verify players table schema
- Check for unique constraints

## 🔧 Advanced Testing

### Testing Offline Mode
1. Run app with internet connection
2. Let it cache data (run a game)
3. Turn off internet/airplane mode
4. Run tests - should work with cached data
5. Turn internet back on
6. Check sync functionality

### Testing RLS Policies
The tests include basic RLS testing, but for comprehensive security testing:
1. Test with different user contexts
2. Verify unauthorized access is blocked
3. Check data isolation between users

### Performance Testing
Monitor test execution times:
- Database queries should be < 1 second
- Batch operations should be efficient
- Large data sets should paginate properly

## 📱 Integration in Your App

### Temporary Testing Screen
Create a dedicated testing screen for development:

```tsx
// src/screens/TestingScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import TestRunner from '../components/TestRunner';

export default function TestingScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TestRunner />
    </SafeAreaView>
  );
}
```

### Production Considerations
- Remove test components before production build
- Keep test files for ongoing development
- Use tests in CI/CD pipeline
- Regular testing after Supabase updates

## 🎯 Test Coverage

### Backend Coverage
- ✅ Database connectivity
- ✅ All table operations
- ✅ Views and functions
- ✅ RLS policies
- ✅ Data relationships
- ✅ Error handling

### App Services Coverage  
- ✅ Service initialization
- ✅ Data transformation
- ✅ Error handling
- ✅ Offline capabilities
- ✅ Sync functionality
- ✅ Network detection

### Integration Coverage
- ✅ End-to-end game flow
- ✅ Player management
- ✅ Session persistence
- ✅ Match history
- ✅ Statistics tracking

## 🚨 Troubleshooting

### Test Failures
1. **Check Supabase Dashboard**: Verify tables and data exist
2. **Review Console Logs**: Look for specific error messages
3. **Network Issues**: Ensure stable internet connection
4. **RLS Policies**: May block some operations (expected)
5. **Data Conflicts**: Clean up test data if needed

### Performance Issues
1. **Slow Queries**: Check database indexes
2. **Large Responses**: Implement pagination
3. **Network Timeout**: Increase timeout settings
4. **Memory Usage**: Monitor for memory leaks

## 📈 Continuous Testing

### Development Workflow
1. Run basic connection test daily
2. Run comprehensive tests before major changes
3. Use app integration tests for feature development
4. Test offline mode regularly

### Automated Testing
Consider integrating these tests into your CI/CD pipeline:
```yaml
# Example GitHub Actions step
- name: Test Supabase Integration
  run: node test-supabase-simple.mjs
```

## 🎉 Success Metrics

Your Supabase integration is ready for production when:
- ✅ All basic tests pass consistently
- ✅ Comprehensive tests complete without errors
- ✅ App services tests show 100% success rate
- ✅ Offline mode works seamlessly
- ✅ Real game sessions save and sync correctly

---

**💡 Pro Tip**: Run these tests regularly during development to catch integration issues early and ensure your Supabase setup remains healthy!
