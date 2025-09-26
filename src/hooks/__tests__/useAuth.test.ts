import React from 'react';
import { render } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { useAuth as useAuthContext } from '../../contexts/AuthContext';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { Text, View } from 'react-native';

// Test component to use the hook
const TestComponent = () => {
  const auth = useAuth();
  return (
    <View>
      <Text testID="user-id">{auth.user ? auth.user.id : 'no-user'}</Text>
      <Text testID="loading">{auth.loading ? 'loading' : 'not-loading'}</Text>
      <Text testID="session">{auth.session ? auth.session.access_token : 'no-session'}</Text>
    </View>
  );
};

describe('useAuth hook', () => {
  const mockAuthContext = {
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
    },
    session: {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
    },
    loading: false,
    signOut: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the auth context value', () => {
    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('user-id')).toHaveTextContent('mock-user-id');
    expect(getByTestId('loading')).toHaveTextContent('not-loading');
    expect(getByTestId('session')).toHaveTextContent('mock-token');
    expect(useAuthContext).toHaveBeenCalled();
  });

  it('returns loading state when context is loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      loading: true,
      user: null,
      session: null,
    });

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('loading')).toHaveTextContent('loading');
    expect(getByTestId('user-id')).toHaveTextContent('no-user');
    expect(getByTestId('session')).toHaveTextContent('no-session');
  });

  it('returns null user and session when not authenticated', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      user: null,
      session: null,
    });

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('user-id')).toHaveTextContent('no-user');
    expect(getByTestId('session')).toHaveTextContent('no-session');
    expect(getByTestId('loading')).toHaveTextContent('not-loading');
  });
});
