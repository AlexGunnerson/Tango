import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileScreen from '../ProfileScreen';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

// Mock useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation();

describe('ProfileScreen', () => {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
  };

  const mockSignOut = jest.fn();

  const mockSupabaseChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    upsert: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });
    (supabase.from as jest.Mock).mockReturnValue(mockSupabaseChain);
  });

  it('renders loading state initially', () => {
    mockSupabaseChain.single.mockResolvedValue({ 
      data: null, 
      error: null 
    });

    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Loading profile...')).toBeDefined();
  });

  it('loads and displays user profile data', async () => {
    const mockProfile = {
      id: 'mock-user-id',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      website: 'https://example.com',
      updated_at: '2023-01-01T00:00:00Z',
    };

    mockSupabaseChain.single.mockResolvedValue({ 
      data: mockProfile, 
      error: null 
    });

    const { getByDisplayValue } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByDisplayValue('testuser')).toBeDefined();
      expect(getByDisplayValue('Test User')).toBeDefined();
      expect(getByDisplayValue('https://example.com')).toBeDefined();
    });
  });

  it('handles profile loading error', async () => {
    mockSupabaseChain.single.mockResolvedValue({ 
      data: null, 
      error: { message: 'Profile not found' }
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Profile not found');
    });
  });

  it('updates profile when Update button is pressed', async () => {
    const mockProfile = {
      id: 'mock-user-id',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      website: 'https://example.com',
      updated_at: '2023-01-01T00:00:00Z',
    };

    mockSupabaseChain.single.mockResolvedValue({ 
      data: mockProfile, 
      error: null 
    });

    mockSupabaseChain.upsert.mockResolvedValue({ 
      error: null 
    });

    const { getByDisplayValue, getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByDisplayValue('testuser')).toBeDefined();
    });

    // Update username
    fireEvent.changeText(getByDisplayValue('testuser'), 'newusername');
    fireEvent.press(getByText('Update Profile'));

    await waitFor(() => {
      expect(mockSupabaseChain.upsert).toHaveBeenCalledWith({
        id: 'mock-user-id',
        username: 'newusername',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        website: 'https://example.com',
        updated_at: expect.any(String),
      });
    });
  });

  it('handles profile update error', async () => {
    const mockProfile = {
      id: 'mock-user-id',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: '',
      website: '',
      updated_at: '2023-01-01T00:00:00Z',
    };

    mockSupabaseChain.single.mockResolvedValue({ 
      data: mockProfile, 
      error: null 
    });

    mockSupabaseChain.upsert.mockResolvedValue({ 
      error: { message: 'Update failed' }
    });

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Update Profile')).toBeDefined();
    });

    fireEvent.press(getByText('Update Profile'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Update failed');
    });
  });

  it('calls signOut when Sign Out button is pressed', async () => {
    mockSupabaseChain.single.mockResolvedValue({ 
      data: {
        id: 'mock-user-id',
        username: 'testuser',
        full_name: 'Test User',
        avatar_url: '',
        website: '',
        updated_at: '2023-01-01T00:00:00Z',
      }, 
      error: null 
    });

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Sign Out')).toBeDefined();
    });

    fireEvent.press(getByText('Sign Out'));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('disables buttons when updating', async () => {
    const mockProfile = {
      id: 'mock-user-id',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: '',
      website: '',
      updated_at: '2023-01-01T00:00:00Z',
    };

    mockSupabaseChain.single.mockResolvedValue({ 
      data: mockProfile, 
      error: null 
    });

    // Make the update promise hang to keep updating state
    mockSupabaseChain.upsert.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Update Profile')).toBeDefined();
    });

    fireEvent.press(getByText('Update Profile'));

    // Check that button is disabled
    const updateButton = getByText('Updating Profile...').parent;
    expect(updateButton?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ opacity: 0.7 })
      ])
    );
  });
});
