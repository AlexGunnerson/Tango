import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

import { Text, View, TouchableOpacity } from 'react-native';

// Test component to access auth context
const TestComponent = () => {
  const { user, session, loading, signOut } = useAuth();
  return (
    <View>
      <Text testID="user">{user ? user.id : 'no-user'}</Text>
      <Text testID="session">{session ? session.access_token : 'no-session'}</Text>
      <Text testID="loading">{loading ? 'loading' : 'not-loading'}</Text>
      <TouchableOpacity testID="signOut" onPress={signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('AuthContext', () => {
  const mockSession = {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: 'bearer',
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial loading state', async () => {
    const mockGetSession = supabase.auth.getSession as jest.Mock;
    const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;
    
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('loading')).toHaveTextContent('loading');
    expect(getByTestId('user')).toHaveTextContent('no-user');
    expect(getByTestId('session')).toHaveTextContent('no-session');
  });

  it('provides user and session when authenticated', async () => {
    const mockGetSession = supabase.auth.getSession as jest.Mock;
    const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;
    
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('not-loading');
    });

    expect(getByTestId('user')).toHaveTextContent('mock-user-id');
    expect(getByTestId('session')).toHaveTextContent('mock-token');
  });

  it('calls supabase signOut when signOut is called', async () => {
    const mockGetSession = supabase.auth.getSession as jest.Mock;
    const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;
    const mockSignOut = supabase.auth.signOut as jest.Mock;
    
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
    mockSignOut.mockResolvedValue({ error: null });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Simulate sign out call
    const signOutButton = getByTestId('signOut');
    fireEvent.press(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Reset the mock to simulate no provider
    jest.resetModules();
    
    // Re-import with no mock to test the actual error
    jest.unmock('../../contexts/AuthContext');
    
    const { useAuth } = require('../../contexts/AuthContext');
    
    const FailingComponent = () => {
      const auth = useAuth();
      return <div>{auth.user?.id}</div>;
    };
    
    expect(() => render(<FailingComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleSpy.mockRestore();
  });
});
