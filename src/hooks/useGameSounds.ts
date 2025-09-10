import { useEffect, useCallback, useState } from 'react';
import { soundService } from '../services/soundService';

// For now, we'll use simple beep sounds programmatically
// Later these can be replaced with actual sound files
const createBeepSound = async (frequency: number, duration: number) => {
  // This is a placeholder - in a real app you'd have actual sound files
  // For now we'll just use console logs to indicate when sounds would play
  console.log(`🔊 Playing beep sound: ${frequency}Hz for ${duration}ms`);
};

export const useGameSounds = () => {
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  useEffect(() => {
    // Initialize sound service when hook is first used
    const initializeSounds = async () => {
      await soundService.initialize();
      
      // Load actual sound files
      try {
        // Load the 5-second countdown file
        await soundService.loadSound('fiveSecondCountdown', require('../../assets/sounds/five-second-countdown.wav'));
        
        // Placeholder sounds for other effects (will be added later)
        // await soundService.loadSound('gameStart', require('../../assets/sounds/game-start.wav'));
        // await soundService.loadSound('timeUp', require('../../assets/sounds/time-up.wav'));
        // await soundService.loadSound('winner', require('../../assets/sounds/winner.wav'));
        // await soundService.loadSound('buttonClick', require('../../assets/sounds/button-click.wav'));
        
        console.log('🎵 Game sounds initialized with five-second countdown');
        setSoundsLoaded(true);
      } catch (error) {
        console.warn('Failed to load game sounds:', error);
        setSoundsLoaded(false);
      }
    };

    initializeSounds();

    // Cleanup on unmount
    return () => {
      soundService.unloadAllSounds();
    };
  }, []);

  const playFiveSecondCountdown = useCallback(async () => {
    if (!soundsLoaded) {
      console.log('🔊 Sounds not loaded yet, skipping countdown');
      return;
    }
    console.log('🔊 Playing 5-second countdown');
    try {
      await soundService.playFiveSecondCountdown();
    } catch (error) {
      console.warn('Failed to play 5-second countdown:', error);
    }
  }, [soundsLoaded]);

  const playCountdownTick = useCallback(async () => {
    console.log('🔊 Countdown tick sound');
    await createBeepSound(800, 200);
    // await soundService.playCountdownTick();
  }, []);

  const playCountdownFinal = useCallback(async () => {
    console.log('🔊 Countdown final sound');
    await createBeepSound(1000, 500);
    // await soundService.playCountdownFinal();
  }, []);

  const playGameStart = useCallback(async () => {
    console.log('🔊 Game start sound');
    await createBeepSound(600, 800);
    // await soundService.playGameStart();
  }, []);

  const playTimeUp = useCallback(async () => {
    console.log('🔊 Time up sound');
    await createBeepSound(400, 1000);
    // await soundService.playTimeUp();
  }, []);

  const playWinner = useCallback(async () => {
    console.log('🔊 Winner celebration sound');
    await createBeepSound(1200, 1500);
    // await soundService.playWinner();
  }, []);

  const playButtonClick = useCallback(async () => {
    console.log('🔊 Button click sound');
    await createBeepSound(1000, 100);
    // await soundService.playButtonClick();
  }, []);

  const stopAllSounds = useCallback(async () => {
    console.log('🔊 Stopping all sounds');
    await soundService.stopAllSounds();
  }, []);

  return {
    playFiveSecondCountdown,
    playCountdownTick,
    playCountdownFinal,
    playGameStart,
    playTimeUp,
    playWinner,
    playButtonClick,
    stopAllSounds,
    soundsLoaded,
  };
};
