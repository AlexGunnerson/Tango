import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { runAppServicesTests } from '../../test-app-services';

/**
 * TestRunner Component
 * 
 * A React Native component that provides a UI for running Supabase integration tests.
 * Add this component to any screen in your app to test the backend integration.
 * 
 * Usage:
 * import TestRunner from '../components/TestRunner';
 * 
 * Then in your JSX:
 * <TestRunner />
 */

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  timestamp?: string;
}

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ passed: number; failed: number; total: number } | null>(null);

  const runTests = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setTestResults([]);
    setSummary(null);

    // Capture console logs to display in UI
    const originalLog = console.log;
    const originalError = console.error;
    const logs: TestResult[] = [];

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('✅') || message.includes('❌')) {
        const status = message.includes('✅') ? 'passed' : 'failed';
        const name = message.replace(/[✅❌]/g, '').trim();
        logs.push({
          name,
          status,
          message,
          timestamp: new Date().toLocaleTimeString()
        });
        setTestResults([...logs]);
      }
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('❌')) {
        const name = message.replace(/❌/g, '').trim();
        logs.push({
          name,
          status: 'failed',
          message,
          timestamp: new Date().toLocaleTimeString()
        });
        setTestResults([...logs]);
      }
      originalError(...args);
    };

    try {
      await runAppServicesTests();
      
      // Calculate summary
      const passed = logs.filter(log => log.status === 'passed').length;
      const failed = logs.filter(log => log.status === 'failed').length;
      setSummary({ passed, failed, total: passed + failed });
      
    } catch (error) {
      Alert.alert('Test Error', `Tests failed to run: ${error}`);
    } finally {
      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setSummary(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'running': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      default: return '⭕';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Supabase Integration Tests</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.runButton, isRunning && styles.disabledButton]} 
          onPress={runTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '⏳ Running Tests...' : '🚀 Run Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>🗑️ Clear</Text>
        </TouchableOpacity>
      </View>

      {summary && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>📊 Test Summary</Text>
          <Text style={styles.summaryText}>
            ✅ Passed: {summary.passed} | ❌ Failed: {summary.failed} | 📈 Total: {summary.total}
          </Text>
          <Text style={styles.summaryText}>
            🎯 Success Rate: {summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(1) : 0}%
          </Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {testResults.length === 0 && !isRunning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tests run yet</Text>
            <Text style={styles.emptySubtext}>Tap "Run Tests" to start testing your Supabase integration</Text>
          </View>
        )}
        
        {testResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultIcon, { color: getStatusColor(result.status) }]}>
                {getStatusIcon(result.status)}
              </Text>
              <Text style={styles.resultName} numberOfLines={2}>
                {result.name}
              </Text>
              {result.timestamp && (
                <Text style={styles.resultTime}>{result.timestamp}</Text>
              )}
            </View>
            {result.message && (
              <Text style={styles.resultMessage} numberOfLines={3}>
                {result.message}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 These tests verify your Supabase integration is working correctly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  runButton: {
    backgroundColor: '#007bff',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  summary: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  resultItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  resultName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  resultTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  resultMessage: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 28,
    fontFamily: 'monospace',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});
