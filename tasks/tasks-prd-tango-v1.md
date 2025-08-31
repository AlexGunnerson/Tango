## Relevant Files

- `src/components/GameLibrary.tsx` - Main component for browsing and filtering the game library
- `src/components/GameLibrary.test.tsx` - Unit tests for GameLibrary component
- `src/components/GameModes.tsx` - Component for selecting different game modes (1v1, 2v2, Co-Op, Tournament)
- `src/components/GameModes.test.tsx` - Unit tests for GameModes component
- `src/components/TangoFlow/` - Directory containing all components for the 1v1 Tango flow
- `src/components/TangoFlow/PlayerSelection.tsx` - Component for selecting opponent and entering names
- `src/components/TangoFlow/PlayerSelection.test.tsx` - Unit tests for PlayerSelection
- `src/components/TangoFlow/PunishmentSelection.tsx` - Component for selecting punishment before game starts
- `src/components/TangoFlow/PunishmentSelection.test.tsx` - Unit tests for PunishmentSelection
- `src/components/TangoFlow/ItemGathering.tsx` - Component for confirming available household items
- `src/components/TangoFlow/ItemGathering.test.tsx` - Unit tests for ItemGathering
- `src/components/TangoFlow/GameInstructions.tsx` - Component displaying game instructions and tutorial video
- `src/components/TangoFlow/GameInstructions.test.tsx` - Unit tests for GameInstructions
- `src/components/TangoFlow/Gameplay.tsx` - Main gameplay screen with timer and controls
- `src/components/TangoFlow/Gameplay.test.tsx` - Unit tests for Gameplay
- `src/components/TangoFlow/Scoring.tsx` - Component for round scoring and winner selection
- `src/components/TangoFlow/Scoring.test.tsx` - Unit tests for Scoring
- `src/components/TangoFlow/GameConclusion.tsx` - Final screen with winner celebration and punishment
- `src/components/TangoFlow/GameConclusion.test.tsx` - Unit tests for GameConclusion
- `src/components/ReplayLibrary.tsx` - Component for viewing saved photos and videos
- `src/components/ReplayLibrary.test.tsx` - Unit tests for ReplayLibrary
- `src/services/gameService.ts` - Service for game logic, selection, and management
- `src/services/gameService.test.ts` - Unit tests for game service
- `src/services/mediaService.ts` - Service for handling camera, photo, and video recording
- `src/services/mediaService.test.ts` - Unit tests for media service
- `src/types/game.ts` - TypeScript interfaces for game-related data structures
- `src/types/user.ts` - TypeScript interfaces for user and gameplay data
- `src/data/games.json` - JSON file containing all game data, instructions, and metadata
- `src/data/punishments.json` - JSON file containing pre-written punishment options
- `src/utils/gameLogic.ts` - Utility functions for game selection, handicap calculation, etc.
- `src/utils/gameLogic.test.ts` - Unit tests for game logic utilities
- `src/utils/timer.ts` - Timer utility functions for gameplay
- `src/utils/timer.test.ts` - Unit tests for timer utilities
- `src/screens/HomeScreen.tsx` - Main home screen with navigation to different features
- `src/screens/HomeScreen.test.tsx` - Unit tests for HomeScreen
- `App.tsx` - Root application component with navigation setup
- `App.test.tsx` - Unit tests for main App component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Project Setup & Core Infrastructure (Mock Data First)
  - [ ] 1.1 Initialize Expo React Native project with TypeScript
  - [ ] 1.2 Install and configure Tailwind CSS (NativeWind)
  - [ ] 1.3 Set up project folder structure (components, screens, services, utils, types, data)
  - [ ] 1.4 Configure Jest testing framework
  - [ ] 1.5 Create TypeScript interfaces for core data types (Game, User, GameSession)
  - [ ] 1.6 Create mock data files (games.json, punishments.json)
  - [ ] 1.7 Set up basic navigation structure with React Navigation
  - [ ] 1.8 Configure app icons, splash screen, and basic app metadata

- [ ] 2.0 Home Screen & Navigation
  - [ ] 2.1 Create main HomeScreen component with game mode selection
  - [ ] 2.2 Design and implement game mode cards (1v1, 2v2, Co-Op, Tournament)
  - [ ] 2.3 Add navigation to Game Library from home screen
  - [ ] 2.4 Implement responsive layout for different screen sizes
  - [ ] 2.5 Add basic app branding and visual design elements
  - [ ] 2.6 Create navigation header with app logo
  - [ ] 2.7 Write unit tests for HomeScreen component

- [ ] 3.0 1v1 Tango Flow Implementation
  - [ ] 3.1 Create PlayerSelection screen for entering opponent name
  - [ ] 3.2 Implement PunishmentSelection screen with random punishment options
  - [ ] 3.3 Build ItemGathering screen for confirming available household items
  - [ ] 3.4 Create game selection animation and random game picker
  - [ ] 3.5 Implement GameInstructions screen with tutorial video placeholder
  - [ ] 3.6 Build Gameplay screen with timer, pause/reset controls, and turn indicator
  - [ ] 3.7 Create Scoring screen for round winner selection and scoreboard
  - [ ] 3.8 Implement handicap system for players with 2-game lead
  - [ ] 3.9 Build GameConclusion screen with winner celebration and punishment display
  - [ ] 3.10 Add sound effects for countdown, round end, and game completion
  - [ ] 3.11 Create game logic service for managing 1v1 flow state
  - [ ] 3.12 Write comprehensive unit tests for all 1v1 components and logic

- [ ] 4.0 2v2 Game Mode Implementation
  - [ ] 4.1 Create TeamSelection screen for forming teams
  - [ ] 4.2 Adapt ItemGathering for team-based item confirmation
  - [ ] 4.3 Modify game selection to filter for team-compatible games
  - [ ] 4.4 Update Gameplay screen for team turn indicators
  - [ ] 4.5 Adapt Scoring screen for team-based scoring
  - [ ] 4.6 Implement team-based GameConclusion with team celebration
  - [ ] 4.7 Create team game logic service
  - [ ] 4.8 Write unit tests for 2v2 components and logic

- [ ] 5.0 Co-Op Game Mode Implementation
  - [ ] 5.1 Create PlayerSetup screen for co-op participant selection
  - [ ] 5.2 Implement cooperative ItemGathering with shared item pool
  - [ ] 5.3 Filter game selection for cooperative-compatible games
  - [ ] 5.4 Build cooperative Gameplay screen with shared objectives
  - [ ] 5.5 Create cooperative Scoring screen with team achievement tracking
  - [ ] 5.6 Implement cooperative GameConclusion with shared celebration
  - [ ] 5.7 Create cooperative game logic service
  - [ ] 5.8 Write unit tests for Co-Op components and logic

- [ ] 6.0 Tournament Game Mode Implementation
  - [ ] 6.1 Create TournamentSetup screen for bracket configuration
  - [ ] 6.2 Implement bracket visualization component
  - [ ] 6.3 Build tournament progression logic and bracket updates
  - [ ] 6.4 Integrate existing game flows into tournament structure
  - [ ] 6.5 Create tournament management screens for hosts
  - [ ] 6.6 Implement tournament conclusion with final winner celebration
  - [ ] 6.7 Create tournament logic service
  - [ ] 6.8 Write unit tests for Tournament components and logic

- [ ] 7.0 Game Library & Filtering System
  - [ ] 7.1 Create GameLibrary screen with grid/list view of all games
  - [ ] 7.2 Implement filtering by category (Creative, Physical, Foodie)
  - [ ] 7.3 Add filtering by theme (Christmas, Halloween, etc.)
  - [ ] 7.4 Create filtering by available household items
  - [ ] 7.5 Build individual GameDetail screen with instructions and video
  - [ ] 7.6 Implement search functionality for finding specific games
  - [ ] 7.7 Add game favoriting and recently played tracking
  - [ ] 7.8 Create game service for library management
  - [ ] 7.9 Write unit tests for GameLibrary components and services

- [ ] 8.0 Supabase Backend Integration
  - [ ] 8.1 Set up Supabase project and configure database schema
  - [ ] 8.2 Create database tables for games, users, and game sessions
  - [ ] 8.3 Replace mock game data with Supabase queries
  - [ ] 8.4 Implement real-time game session synchronization for remote play
  - [ ] 8.5 Set up Row Level Security (RLS) policies
  - [ ] 8.6 Create API service layer for Supabase integration
  - [ ] 8.7 Update all components to use real backend data
  - [ ] 8.8 Write integration tests for backend connectivity

- [ ] 9.0 Authentication System (Google Auth, Apple Auth)
  - [ ] 9.1 Configure Supabase Auth with Google and Apple providers
  - [ ] 9.2 Create login/signup screens with social auth buttons
  - [ ] 9.3 Implement authentication flow and session management
  - [ ] 9.4 Create user profile screens and account management
  - [ ] 9.5 Add authentication guards to protected features
  - [ ] 9.6 Implement guest mode for trying the app without signup
  - [ ] 9.7 Write unit tests for authentication components and flows

- [ ] 10.0 Premium Features & Monetization
  - [ ] 10.1 Integrate in-app purchase system (App Store/Google Play)
  - [ ] 10.2 Implement premium game library unlock functionality
  - [ ] 10.3 Create premium tournament feature access controls
  - [ ] 10.4 Build expansion pack purchase and download system
  - [ ] 10.5 Implement free game rotation system (10 rotating free games)
  - [ ] 10.6 Create purchase confirmation and receipt management
  - [ ] 10.7 Add premium status indicators throughout the app
  - [ ] 10.8 Write unit tests for monetization features
