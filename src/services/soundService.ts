import { Audio } from 'expo-av';

class SoundService {
  private sounds: { [key: string]: Audio.Sound } = {};
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }

  async loadSound(soundName: string, soundUri: any) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Loading sound: ${soundName}`, soundUri);
      const { sound } = await Audio.Sound.createAsync(soundUri);
      this.sounds[soundName] = sound;
      console.log(`Successfully loaded sound: ${soundName}`);
      return sound;
    } catch (error) {
      console.error(`Failed to load sound ${soundName}:`, error);
      return null;
    }
  }

  async playSound(soundName: string, options: { volume?: number; rate?: number; shouldLoop?: boolean } = {}) {
    try {
      const sound = this.sounds[soundName];
      if (!sound) {
        console.warn(`Sound ${soundName} not found`);
        return;
      }

      // Set options if provided
      if (options.volume !== undefined) {
        await sound.setVolumeAsync(options.volume);
      }
      if (options.rate !== undefined) {
        await sound.setRateAsync(options.rate, true);
      }
      if (options.shouldLoop !== undefined) {
        await sound.setIsLoopingAsync(options.shouldLoop);
      }

      // Rewind to beginning and play
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error);
    }
  }

  async stopSound(soundName: string) {
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.warn(`Failed to stop sound ${soundName}:`, error);
    }
  }

  async stopAllSounds() {
    try {
      const promises = Object.values(this.sounds).map(sound => sound.stopAsync());
      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to stop all sounds:', error);
    }
  }

  async unloadSound(soundName: string) {
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        await sound.unloadAsync();
        delete this.sounds[soundName];
      }
    } catch (error) {
      console.warn(`Failed to unload sound ${soundName}:`, error);
    }
  }

  async unloadAllSounds() {
    try {
      const promises = Object.entries(this.sounds).map(async ([name, sound]) => {
        await sound.unloadAsync();
        delete this.sounds[name];
      });
      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to unload all sounds:', error);
    }
  }

  // Game-specific sound methods
  async playFiveSecondCountdown() {
    await this.playSound('fiveSecondCountdown', { volume: 0.7 });
  }

  async playCountdownTick() {
    await this.playSound('countdownTick', { volume: 0.7 });
  }

  async playCountdownFinal() {
    await this.playSound('countdownFinal', { volume: 0.8 });
  }

  async playGameStart() {
    await this.playSound('gameStart', { volume: 0.6 });
  }

  async playTimeUp() {
    await this.playSound('timeUp', { volume: 0.8 });
  }

  async playWinner() {
    await this.playSound('winner', { volume: 0.7 });
  }

  async playButtonClick() {
    await this.playSound('buttonClick', { volume: 0.5 });
  }
}

// Create and export a singleton instance
export const soundService = new SoundService();
export default soundService;
