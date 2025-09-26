import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AuthScreen from '../AuthScreen';
import { supabase } from '../../lib/supabase';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation();

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    const { getByTestId, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    expect(getByTestId('email-input')).toBeDefined();
    expect(getByTestId('password-input')).toBeDefined();
    expect(getByText('Sign In')).toBeDefined();
    expect(getByText("Don't have an account? Sign Up")).toBeDefined();
  });

  it('toggles to signup form when switch button is pressed', () => {
    const { getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Don't have an account? Sign Up"));
    expect(getByText('Sign Up')).toBeDefined();
    expect(getByText('Already have an account? Sign In')).toBeDefined();
  });

  it('calls signInWithPassword when sign in button is pressed', async () => {
    const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
    mockSignIn.mockResolvedValue({ error: null });

    const { getByTestId, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('calls signUp when sign up button is pressed', async () => {
    const mockSignUp = supabase.auth.signUp as jest.Mock;
    mockSignUp.mockResolvedValue({ error: null });

    const { getByTestId, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    // Switch to sign up mode
    fireEvent.press(getByText("Don't have an account? Sign Up"));

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows alert when sign in fails', async () => {
    const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } });

    const { getByTestId, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrongpassword');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });

  it('calls signInWithOAuth when Google button is pressed', async () => {
    const mockSignInWithOAuth = supabase.auth.signInWithOAuth as jest.Mock;
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    const { getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Continue with Google'));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
      });
    });
  });

  it('calls signInWithOAuth when Apple button is pressed', async () => {
    const mockSignInWithOAuth = supabase.auth.signInWithOAuth as jest.Mock;
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    const { getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Continue with Apple'));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'apple',
      });
    });
  });

  it('navigates to Home when Continue as Guest is pressed', () => {
    const { getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Continue as Guest'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('disables buttons when loading', async () => {
    const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
    // Make the promise hang to keep loading state
    mockSignIn.mockImplementation(() => new Promise(() => {}));

    const { getByTestId, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByText('Sign In'));

    // Check that button is disabled
    const signInButton = getByText('Sign In').parent;
    expect(signInButton?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ opacity: 0.7 })
      ])
    );
  });
});
