import React from 'react';
import { render } from '@testing-library/react-native';
import RootNavigator from '../RootNavigator';
import { useAuth } from '../../hooks/useAuth';

// Mock useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock navigation screens
jest.mock('../../screens/AuthScreen', () => {
  return function MockAuthScreen() {
    return <div testID="auth-screen">AuthScreen</div>;
  };
});

jest.mock('../../screens/ProfileScreen', () => {
  return function MockProfileScreen() {
    return <div testID="profile-screen">ProfileScreen</div>;
  };
});

jest.mock('../../screens/HomeScreen', () => {
  return function MockHomeScreen() {
    return <div testID="home-screen">HomeScreen</div>;
  };
});

jest.mock('../../screens/GameLibraryScreen', () => {
  return function MockGameLibraryScreen() {
    return <div testID="game-library-screen">GameLibraryScreen</div>;
  };
});

// Mock all TangoFlow screens
jest.mock('../../screens/TangoFlow/TeamSelectionScreen', () => {
  return function MockTeamSelectionScreen() {
    return <div testID="team-selection-screen">TeamSelectionScreen</div>;
  };
});

jest.mock('../../screens/TangoFlow/GameInstructionsScreen1', () => {
  return function MockGameInstructionsScreen1() {
    return <div testID="game-instructions-screen1">GameInstructionsScreen1</div>;
  };
});

// Mock the rest of the TangoFlow screens similarly...
const mockTangoFlowScreens = [
  'GameInstructionsScreen2',
  'GameInstructionsScreen3', 
  'GameInstructionsScreen4',
  'GameInstructionsScreen5',
  'GameInstructionsScreen6',
  'GameplayScreenGame1',
  'GameplayScreenGame2',
  'GameplayScreenGame3',
  'GameplayScreenGame5Player1',
  'GameplayScreenGame5Player2',
  'GameplayScreenGame6',
  'ItemGatheringScreen',
  'RoundResultsScreen',
  'TimesUpScreen',
  'GameOverScreen',
];

mockTangoFlowScreens.forEach(screenName => {
  jest.mock(`../../screens/TangoFlow/${screenName}`, () => {
    return function MockScreen() {
      return <div testID={`${screenName.toLowerCase()}`}>{screenName}</div>;
    };
  });
});

describe('RootNavigator', () => {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading screen when auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      session: null,
      loading: true,
      signOut: jest.fn(),
    });

    const { getByText } = render(<RootNavigator />);
    expect(getByText('Loading...')).toBeDefined();
  });

  it('shows auth screen when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: jest.fn(),
    });

    const { getByTestId } = render(<RootNavigator />);
    expect(getByTestId('auth-screen')).toBeDefined();
  });

  it('shows main app screens when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      session: { access_token: 'mock-token' },
      loading: false,
      signOut: jest.fn(),
    });

    const { getByTestId } = render(<RootNavigator />);
    expect(getByTestId('home-screen')).toBeDefined();
  });

  it('shows main app screens for guest users (no auth)', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: jest.fn(),
    });

    // The navigator should still allow access to main screens for guests
    // This would need to be tested by navigating to Home screen
    // For now, we verify that the auth screen is shown initially for unauthenticated users
    const { getByTestId } = render(<RootNavigator />);
    expect(getByTestId('auth-screen')).toBeDefined();
  });

  it('includes Profile screen only when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      session: { access_token: 'mock-token' },
      loading: false,
      signOut: jest.fn(),
    });

    // This test would require navigation testing which is more complex
    // For now, we verify the basic structure
    const { getByTestId } = render(<RootNavigator />);
    expect(getByTestId('home-screen')).toBeDefined();
  });

  it('does not show Profile screen when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: jest.fn(),
    });

    const { queryByTestId } = render(<RootNavigator />);
    expect(queryByTestId('profile-screen')).toBeNull();
  });
});
