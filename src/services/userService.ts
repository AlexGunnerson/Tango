import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from './supabaseService';

export interface User {
  id: string;
  name: string;
  displayName?: string;
  createdAt: string;
  isGuest: boolean;
}

class UserService {
  private static readonly USER_ID_KEY = 'tango_user_id';
  private static readonly USER_DATA_KEY = 'tango_user_data';
  private currentUser: User | null = null;

  /**
   * Initialize the user system - gets or creates persistent user
   */
  async initialize(): Promise<User> {
    try {
      // Check if we already have a user in memory
      if (this.currentUser) {
        return this.currentUser;
      }

      // Try to get existing user ID from storage
      let userId = await AsyncStorage.getItem(UserService.USER_ID_KEY);
      let userData: User | null = null;

      if (userId) {
        // Try to get user data from storage
        const storedUserData = await AsyncStorage.getItem(UserService.USER_DATA_KEY);
        if (storedUserData) {
          userData = JSON.parse(storedUserData);
        }

        // Verify user exists in database
        const dbUser = await this.getUserFromDatabase(userId);
        if (dbUser) {
          this.currentUser = dbUser;
          // Update local storage with latest data
          await AsyncStorage.setItem(UserService.USER_DATA_KEY, JSON.stringify(dbUser));
          return dbUser;
        }
      }

      // Create new user if none exists
      const newUser = await this.createNewUser();
      this.currentUser = newUser;
      
      // Store user ID and data locally
      await AsyncStorage.setItem(UserService.USER_ID_KEY, newUser.id);
      await AsyncStorage.setItem(UserService.USER_DATA_KEY, JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      console.error('Error initializing user:', error);
      throw error;
    }
  }

  /**
   * Get current user (must call initialize first)
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current user ID (must call initialize first)
   */
  getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  /**
   * Update current user's display name
   */
  async updateUserName(name: string, displayName?: string): Promise<void> {
    try {
      if (!this.currentUser) {
        throw new Error('No current user found. Call initialize() first.');
      }

      // Update in database
      await supabaseService.updatePlayer(this.currentUser.id, { 
        name, 
        display_name: displayName 
      });

      // Update local user object
      this.currentUser = {
        ...this.currentUser,
        name,
        displayName
      };

      // Update local storage
      await AsyncStorage.setItem(UserService.USER_DATA_KEY, JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  }

  /**
   * Create a guest player (temporary, no persistent storage)
   */
  createGuestPlayer(name: string): User {
    return {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: new Date().toISOString(),
      isGuest: true
    };
  }

  /**
   * Clear user data (for testing/reset)
   */
  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(UserService.USER_ID_KEY);
      await AsyncStorage.removeItem(UserService.USER_DATA_KEY);
      this.currentUser = null;
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  // Private methods

  private async createNewUser(): Promise<User> {
    try {
      // Generate a default name
      const defaultName = `Player${Math.floor(Math.random() * 10000)}`;
      
      // Create user in database
      const dbUser = await supabaseService.createPlayer({
        name: defaultName,
        display_name: defaultName
      });

      return {
        id: dbUser.id,
        name: dbUser.name,
        displayName: dbUser.display_name || dbUser.name,
        createdAt: dbUser.created_at,
        isGuest: false
      };
    } catch (error) {
      console.error('Error creating new user:', error);
      throw error;
    }
  }

  private async getUserFromDatabase(userId: string): Promise<User | null> {
    try {
      const dbUser = await supabaseService.getPlayer(userId);
      if (!dbUser) return null;

      return {
        id: dbUser.id,
        name: dbUser.name,
        displayName: dbUser.display_name || dbUser.name,
        createdAt: dbUser.created_at,
        isGuest: false
      };
    } catch (error) {
      console.error('Error getting user from database:', error);
      return null;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
