# Sound Assets

This directory contains sound files for the Tango app. Currently, the app uses placeholder console logs instead of actual audio files.

## Sound Files

### ✅ Currently Active
- `five-second-countdown.wav` - **ACTIVE** - Full 5-second countdown before games start

### 🔄 Still Needed
- `game-start.wav` - Sound played when game timer starts (after countdown)
- `time-up.wav` - Sound played when game timer ends
- `winner.wav` - Celebration sound for winner screen
- `button-click.wav` - Short click sound for button interactions

## File Format Recommendations

- **Format**: MP3 or WAV
- **Duration**: 
  - Countdown tick: ~200ms
  - Countdown final: ~500ms
  - Game start: ~800ms
  - Time up: ~1000ms
  - Winner: ~1500ms
  - Button click: ~100ms
- **Quality**: 44.1kHz, 16-bit minimum

## Implementation

Once sound files are added, uncomment the loading and playback code in:
- `src/hooks/useGameSounds.ts`
- `src/services/soundService.ts`

The sound system is already integrated into:
- All GameplayScreen components (countdown, game start, time up)
- WinnerScreen (celebration sound)
- ScoringScreen (button clicks)

## Testing

Sound events are logged to the console with 🔊 emoji:

### ✅ Active Sounds
- 🔊 Playing 5-second countdown - **PLAYS ACTUAL AUDIO**

### 🔄 Placeholder Sounds (console only)
- 🔊 Game start sound
- 🔊 Time up sound
- 🔊 Winner celebration sound
- 🔊 Button click sound

## Usage

The 5-second countdown now plays automatically when:
- Any GameplayScreen loads (before the game timer starts)
- The visual countdown (5, 4, 3, 2, 1) is synchronized with the audio
