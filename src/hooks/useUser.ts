import { useState, useEffect } from 'react';
import { userService, User } from '../services/userService';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  updateUserName: (name: string, displayName?: string) => Promise<void>;
  createGuestPlayer: (name: string) => User;
  clearUserData: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user on hook mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const initializedUser = await userService.initialize();
        setUser(initializedUser);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        // Could set a fallback user or show error state
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const updateUserName = async (name: string, displayName?: string) => {
    try {
      await userService.updateUserName(name, displayName);
      const updatedUser = userService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user name:', error);
      throw error;
    }
  };

  const createGuestPlayer = (name: string): User => {
    return userService.createGuestPlayer(name);
  };

  const clearUserData = async () => {
    try {
      await userService.clearUserData();
      setUser(null);
      setIsInitialized(false);
      // Re-initialize after clearing
      const newUser = await userService.initialize();
      setUser(newUser);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isInitialized,
    updateUserName,
    createGuestPlayer,
    clearUserData
  };
}
